from __future__ import annotations

import sys
import threading
from pathlib import Path
import yaml
import numpy as np
import rasterio
import torch
import torch.nn.functional as F

from app.services.datasets import DatasetRegion, _dataset_root_from_env
from app.services.geotiff_predictions import GeotiffPredictResult, export_aligned_masks_to_png

# In-memory model and config cache
_models_cache = {}
_cache_lock = threading.Lock()


def get_device() -> torch.device:
    """Detect and return the best available execution device (CUDA GPU or CPU)."""
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")


def extract_state_dict(ckpt_obj: object) -> dict:
    """
    Extract the raw state_dict from a checkpoint file, handling both
    standard checkpoint dicts (with a 'model_state' key) and direct state_dicts.
    """
    if (
        isinstance(ckpt_obj, dict)
        and "model_state" in ckpt_obj
        and isinstance(ckpt_obj.get("model_state"), dict)
    ):
        return ckpt_obj["model_state"]
    if isinstance(ckpt_obj, dict) and ckpt_obj and all(isinstance(k, str) for k in ckpt_obj.keys()):
        return ckpt_obj
    raise TypeError(
        "Unsupported checkpoint format. Expected a dict with 'model_state' or a raw state_dict."
    )


def get_model(model_name: str) -> tuple[torch.nn.Module, dict]:
    """
    Load a dynamic model checkpoint and its configuration from the models/ directory.
    Threadsafe and uses an in-memory cache to guarantee sub-millisecond lookups after first load.
    """
    global _models_cache
    model_key = model_name.lower().strip()

    with _cache_lock:
        if model_key in _models_cache:
            return _models_cache[model_key]

        # Resolve paths
        project_root = Path(__file__).resolve().parents[3]
        models_dir = project_root / "models"

        config_path = models_dir / f"{model_key}.yaml"
        checkpoint_path = models_dir / f"{model_key}.pth"

        if not config_path.is_file():
            raise FileNotFoundError(f"Model configuration not found: {config_path}")
        if not checkpoint_path.is_file():
            raise FileNotFoundError(f"Model checkpoint not found: {checkpoint_path}")

        # Load YAML config
        with open(config_path, "r", encoding="utf-8") as f:
            config = yaml.safe_load(f)

        # Add model-experiments to Python path dynamically to import the create_model factory
        deeplab_root = project_root / "model-experiments" / "deeplab"
        if str(deeplab_root) not in sys.path:
            sys.path.insert(0, str(deeplab_root))

        try:
            from src.models import create_model
        except ImportError as e:
            raise ImportError(
                f"Could not import create_model from {deeplab_root}. Ensure model-experiments code is intact."
            ) from e

        # Initialize model architecture
        device = get_device()
        model_cfg = config["model"]
        model = create_model(model_cfg).to(device)

        # Load state_dict
        load_kw = {"map_location": device}
        ckpt_obj = torch.load(checkpoint_path, **load_kw)
        state_dict = extract_state_dict(ckpt_obj)
        model.load_state_dict(state_dict, strict=False)
        model.eval()

        # Cache the model and config
        _models_cache[model_key] = (model, config)
        return model, config


def run_live_inference(region: DatasetRegion, model_name: str) -> GeotiffPredictResult:
    """
    Execute real-time PyTorch model inference on the Sentinel-2 GeoTIFF.
    Preprocesses the raw bands, resizes, runs the model forward pass, upsamples the
    probabilities back to native resolution, computes the actual IoU, and exports masks.
    """
    dataset_root = _dataset_root_from_env()
    if dataset_root is None:
        raise ValueError("SATRISK_DATASET_ROOT environment variable is not set.")

    image_path = (dataset_root / region.image_path).resolve()
    gt_path = (dataset_root / region.mask_path).resolve()

    if not image_path.is_file():
        raise FileNotFoundError(f"Sentinel-2 image not found: {image_path}")
    if not gt_path.is_file():
        raise FileNotFoundError(f"Ground truth mask not found: {gt_path}")

    # Load model & config
    model, config = get_model(model_name)
    device = get_device()

    # Read spectral bands
    with rasterio.open(image_path) as src:
        h0, w0 = src.height, src.width
        img_data = src.read().astype(np.float32)  # (C, H, W)

    in_channels = int(config["model"].get("in_channels", 12))
    if img_data.shape[0] > in_channels:
        img_data = img_data[:in_channels]
    elif img_data.shape[0] < in_channels:
        raise ValueError(
            f"Image has {img_data.shape[0]} bands, but model expects {in_channels} channels."
        )

    # Preprocessing and normalization
    band_norm = config["data"].get("band_norm", "reflectance")
    if band_norm == "reflectance":
        img_data /= 10000.0
    elif band_norm == "standard":
        mean = img_data.mean(axis=(1, 2), keepdims=True)
        std = img_data.std(axis=(1, 2), keepdims=True) + 1e-6
        img_data = (img_data - mean) / std

    # Convert to Tensor (1, C, H, W)
    img_tensor = torch.from_numpy(img_data).unsqueeze(0).to(device)

    # Resize to the model's training resolution (e.g., 512x512)
    target_size = config["data"].get("target_size", [512, 512])
    img_resized = F.interpolate(
        img_tensor,
        size=tuple(target_size),
        mode="bilinear",
        align_corners=False,
    )

    # Forward pass
    with torch.no_grad():
        logits = model(img_resized)
        probs = torch.sigmoid(logits)  # (1, 1, H_target, W_target)

    # Upsample probability mask back to original Sentinel-2 resolution
    prob_up = F.interpolate(
        probs,
        size=(h0, w0),
        mode="bilinear",
        align_corners=False,
    )[0, 0]

    # Apply metrics threshold
    threshold = float(config.get("metrics", {}).get("threshold", 0.5))
    pred_b_hw = (prob_up.cpu().numpy() >= threshold).astype(np.uint8)

    # Read ground truth mask
    with rasterio.open(gt_path) as src:
        gt_data = src.read(1)  # (H, W)
    gt_b_hw = (gt_data > 0).astype(np.uint8)

    # Calculate exact dynamic IoU
    inter = int((pred_b_hw & gt_b_hw).sum())
    union = int(((pred_b_hw | gt_b_hw) > 0).sum())
    iou = round(inter / union, 4) if union > 0 else 1.0

    # Save aligned preview PNGs under app/data/
    pred_rel, gt_rel = export_aligned_masks_to_png(
        pred_b_hw=pred_b_hw,
        gt_b_hw=gt_b_hw,
        region_id=region.id,
        model=model_name,
    )

    return GeotiffPredictResult(
        mask_relpath=pred_rel,
        ground_truth_relpath=gt_rel,
        iou=iou,
    )
