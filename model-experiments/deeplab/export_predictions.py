"""
Batch-run a saved segmentation checkpoint, export static PNG masks/visuals, and update metrics.json.

This script is fully offline and generates static outputs to be directly consumed by the frontend.

python model-experiments/deeplab/export_predictions.py `
  --checkpoint models/deeplab.pth `
  --config models/deeplab.yaml `
  --dataset-root data/cems-ground-truth `
  --split-dir . `
  --model-name deeplab `
  --batch-size 1 `
  --device cuda `
  --overwrite

"""

from __future__ import annotations

import argparse
import inspect
import sys
import json
from pathlib import Path

import numpy as np
import rasterio
import torch
import torch.nn.functional as F
import yaml
from torch.utils.data import DataLoader
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.data.datamodule import DataConfig, build_datasets
from src.models import create_model


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Run segmentation checkpoint, export static PNG masks, and update metrics.json.",
    )
    p.add_argument(
        "--checkpoint",
        type=str,
        required=True,
        help="Path to a .pth/.pt file (either a dict with 'model_state' or a raw state_dict).",
    )
    p.add_argument(
        "--config",
        type=str,
        required=True,
        help="YAML config that describes the model and data preprocessing.",
    )
    p.add_argument(
        "--dataset-root",
        type=str,
        required=True,
        help="Root directory that contains the split folder (see --split-dir).",
    )
    p.add_argument(
        "--split-dir",
        type=str,
        required=True,
        help="Subdirectory under dataset-root to scan for *_S2L2A.tif (use '.' if root is already the AOI).",
    )
    p.add_argument(
        "--model-name",
        type=str,
        required=True,
        help="Name of the model (e.g. unet, deeplab) used for directory nesting in output.",
    )
    p.add_argument(
        "--public-root",
        type=str,
        default=str(PROJECT_ROOT.parent.parent / "frontend" / "public"),
        help="Directory path to the frontend public folder.",
    )
    p.add_argument(
        "--split-key",
        type=str,
        default="infer",
        help="Internal split name for DataConfig (only affects logging).",
    )
    p.add_argument("--batch-size", type=int, default=1)
    p.add_argument("--num-workers", type=int, default=2)
    p.add_argument("--device", type=str, default="cuda", choices=["cuda", "cpu"])
    p.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite files even if they already exist in the destination.",
    )
    return p.parse_args()


def load_config(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def extract_state_dict(ckpt_obj: object) -> dict:
    if (
        isinstance(ckpt_obj, dict)
        and "model_state" in ckpt_obj
        and isinstance(ckpt_obj.get("model_state"), dict)
    ):
        return ckpt_obj["model_state"]  # type: ignore[return-value]

    if isinstance(ckpt_obj, dict) and ckpt_obj and all(isinstance(k, str) for k in ckpt_obj.keys()):
        return ckpt_obj  # type: ignore[return-value]

    raise TypeError(
        "Unsupported checkpoint format. Expected a dict with key 'model_state' or a raw state_dict dict."
    )


def write_region_quicklook_png(image_path: Path, dst_path: Path) -> None:
    """Create a lightweight RGB preview PNG for the S2L2A stack."""
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    with rasterio.open(image_path) as src:
        count = src.count
        if count >= 4:
            idx = (4, 3, 2)
        elif count >= 3:
            idx = (1, 2, 3)
        else:
            idx = [1] * 3
            
        bands_to_read = []
        for i in idx:
            if i <= count:
                bands_to_read.append(i)
            else:
                bands_to_read.append(1)
                
        rgb = src.read(bands_to_read).astype(np.float32)  # (3, H, W)

    # Per-band robust scaling
    out = np.zeros_like(rgb, dtype=np.uint8)
    for c in range(3):
        band = rgb[c]
        lo = float(np.percentile(band, 2))
        hi = float(np.percentile(band, 98))
        if not np.isfinite(lo) or not np.isfinite(hi) or hi <= lo:
            hi = lo + 1.0
        scaled = (band - lo) / (hi - lo)
        scaled = np.clip(scaled, 0.0, 1.0)
        out[c] = (scaled * 255.0).astype(np.uint8)

    img = np.transpose(out, (1, 2, 0))  # (H, W, 3)
    pil = Image.fromarray(img, mode="RGB")
    pil.save(dst_path, format="PNG")


def write_ground_truth_png(mask_path: Path, dst_path: Path) -> np.ndarray:
    """Read first band from mask GeoTIFF, save as L-mode binary PNG, and return binary numpy array."""
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    with rasterio.open(mask_path) as src:
        gt_np = src.read(1)
    gt_np = (gt_np > 0).astype(np.uint8)
    
    # Save as PNG (0/255 uint8 grayscale image)
    pil = Image.fromarray((gt_np * 255).astype(np.uint8), mode="L")
    pil.save(dst_path, format="PNG")
    return gt_np


def write_prediction_png(pred_np: np.ndarray, dst_path: Path) -> None:
    """Save binary prediction numpy array as L-mode binary PNG."""
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    pil = Image.fromarray((pred_np * 255).astype(np.uint8), mode="L")
    pil.save(dst_path, format="PNG")


def update_metrics_json(json_path: Path, new_items: list[dict]) -> None:
    """Load existing metrics from JSON file, merge new items (by region_id and model_name), and save."""
    existing_data = []
    if json_path.exists():
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except Exception as e:
            print(f"[export] Warning: Failed to load existing metrics.json: {e}", flush=True)
            existing_data = []
            
    # Use a dictionary to key by (region_id, model_name) to allow easy updates/merging
    data_dict = {}
    for item in existing_data:
        region_id = item.get("region_id")
        model_name = item.get("model_name")
        if region_id and model_name:
            data_dict[(region_id, model_name)] = item
            
    for item in new_items:
        region_id = item.get("region_id")
        model_name = item.get("model_name")
        if region_id and model_name:
            data_dict[(region_id, model_name)] = item
            
    json_path.parent.mkdir(parents=True, exist_ok=True)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(list(data_dict.values()), f, indent=2)


def main() -> None:
    args = parse_args()
    cfg_path = Path(args.config).expanduser().resolve()
    ckpt_path = Path(args.checkpoint).expanduser().resolve()
    dataset_root = Path(args.dataset_root).resolve()
    public_root = Path(args.public_root).resolve()
    model_name = args.model_name.lower().strip()

    if not cfg_path.is_file():
        raise SystemExit(f"config not found: {cfg_path}")
    if not ckpt_path.is_file():
        raise SystemExit(f"checkpoint not found: {ckpt_path}")
    if not dataset_root.is_dir():
        raise SystemExit(f"dataset-root is not a directory: {dataset_root}")

    config = load_config(cfg_path)
    threshold = float(config.get("metrics", {}).get("threshold", 0.5))

    device = torch.device(
        "cuda" if args.device == "cuda" and torch.cuda.is_available() else "cpu"
    )
    print(f"[export] device={device}", flush=True)

    model_cfg = config["model"]
    in_channels = int(model_cfg.get("in_channels", 12))

    data_cfg = DataConfig(
        dataset_root=str(dataset_root),
        split_dirs={args.split_key: args.split_dir},
        image_suffix=config["data"]["image_suffix"],
        mask_suffix=config["data"]["mask_suffix"],
        batch_size=args.batch_size,
        num_workers=args.num_workers,
        band_norm=config["data"].get("band_norm", "reflectance"),
        target_size=config["data"].get("target_size"),
        augmentations=config["data"].get("augmentations"),
    )
    datasets = build_datasets(data_cfg)
    dataset = datasets[args.split_key]
    loader = DataLoader(
        dataset,
        batch_size=args.batch_size,
        shuffle=False,
        num_workers=args.num_workers,
        pin_memory=device.type == "cuda",
    )

    print(f"[export] samples={len(dataset)} split_dir={args.split_dir!r} model_name={model_name} public_root={public_root}", flush=True)

    load_kw: dict = {"map_location": device}
    if "weights_only" in inspect.signature(torch.load).parameters:
        load_kw["weights_only"] = False
    ckpt_obj = torch.load(ckpt_path, **load_kw)
    state_dict = extract_state_dict(ckpt_obj)
    model = create_model(model_cfg).to(device)
    missing, unexpected = model.load_state_dict(state_dict, strict=False)
    if missing:
        print(f"[export] warning: missing keys: {len(missing)}", flush=True)
    if unexpected:
        print(f"[export] warning: unexpected keys: {len(unexpected)}", flush=True)
    model.eval()

    n_written = 0
    new_metrics = []

    for batch in loader:
        images = batch["image"].to(device)
        if images.shape[1] > in_channels:
            images = images[:, :in_channels]
        elif images.shape[1] < in_channels:
            raise RuntimeError(
                f"model expects {in_channels} bands but batch has {images.shape[1]}"
            )

        raw_paths = batch["image_path"]
        if isinstance(raw_paths, str):
            paths = [raw_paths]
        else:
            paths = list(raw_paths)

        with torch.no_grad():
            logits = model(images)
            probs = torch.sigmoid(logits)

        for i, image_path_str in enumerate(paths):
            image_path = Path(image_path_str)
            region_id = image_path.parent.name
            prob = probs[i, 0].detach().cpu()

            with rasterio.open(image_path) as src:
                h0, w0 = src.height, src.width

            prob_up = F.interpolate(
                prob.unsqueeze(0).unsqueeze(0),
                size=(h0, w0),
                mode="bilinear",
                align_corners=False,
            )[0, 0]

            pred_np = (prob_up.numpy() >= threshold).astype(np.uint8)

            # 1. Output prediction PNG mask path
            pred_png_path = public_root / "predictions" / model_name / f"{region_id}.png"
            
            # 2. Output ground truth PNG mask path
            mask_path = Path(str(image_path).replace(config["data"]["image_suffix"], config["data"]["mask_suffix"]))
            gt_png_path = public_root / "ground_truth" / f"{region_id}.png"

            # 3. Output quicklook visual PNG path
            quicklook_png_path = public_root / "region_images" / f"{region_id}.png"

            # Save visual quicklook if not exists or overwrite requested
            if not quicklook_png_path.exists() or args.overwrite:
                write_region_quicklook_png(image_path, quicklook_png_path)
                print(f"[export] Wrote quicklook: {quicklook_png_path}", flush=True)

            # Save ground truth PNG mask if not exists or overwrite requested
            gt_np = None
            if not gt_png_path.exists() or args.overwrite:
                gt_np = write_ground_truth_png(mask_path, gt_png_path)
                print(f"[export] Wrote ground truth: {gt_png_path}", flush=True)
            else:
                with rasterio.open(mask_path) as m_src:
                    gt_np = m_src.read(1)
                gt_np = (gt_np > 0).astype(np.uint8)

            # Save prediction PNG mask if not exists or overwrite requested
            if not pred_png_path.exists() or args.overwrite:
                write_prediction_png(pred_np, pred_png_path)
                print(f"[export] Wrote prediction: {pred_png_path}", flush=True)
                n_written += 1

            # 4. Compute IoU
            inter = int((pred_np & gt_np).sum())
            union = int(((pred_np | gt_np) > 0).sum())
            iou = round(inter / union, 4) if union > 0 else 1.0

            # 5. Add to metrics list
            item = {
                "region_id": region_id,
                "model_name": model_name,
                "iou": float(iou),
                "image_path": f"/region_images/{region_id}.png",
                "image path": f"/region_images/{region_id}.png",
                "prediction_path": f"/predictions/{model_name}/{region_id}.png",
                "prediction path": f"/predictions/{model_name}/{region_id}.png",
                "ground_truth_path": f"/ground_truth/{region_id}.png",
                "ground truth path": f"/ground_truth/{region_id}.png",
            }
            new_metrics.append(item)
            print(f"[export] Region {region_id} - IoU: {iou:.4f}", flush=True)

    # 6. Save/merge into public/data/metrics.json
    metrics_json_path = public_root / "data" / "metrics.json"
    update_metrics_json(metrics_json_path, new_metrics)
    print(f"[export] Done. Saved and merged metrics in {metrics_json_path}. Wrote {n_written} prediction mask(s).", flush=True)


if __name__ == "__main__":
    main()
