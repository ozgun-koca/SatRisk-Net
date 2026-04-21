from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import rasterio
from PIL import Image

from app.services.datasets import DatasetRegion, _dataset_root_from_env


@dataclass(frozen=True)
class GeotiffPredictResult:
    """Paths relative to ``backend/app/data`` (served under ``/static/``)."""

    mask_relpath: str
    ground_truth_relpath: str
    iou: float


def _static_data_dir() -> Path:
    return Path(__file__).resolve().parents[1] / "data"


def export_region_quicklook_png(*, image_path: Path, region_id: str) -> str:
    """
    Create a lightweight RGB preview PNG for the S2L2A stack and store it under
    ``data/region_images/{region_id}.png``.

    This is intentionally simple: it reads 3 bands only and applies percentile
    scaling to [0, 255]. Band choice:
    - if >=4 bands: uses (4, 3, 2) as a common Sentinel-2 RGB convention
    - else: uses (1, 2, 3)
    """
    with rasterio.open(image_path) as src:
        count = src.count
        if count >= 4:
            idx = (4, 3, 2)
        elif count >= 3:
            idx = (1, 2, 3)
        else:
            raise ValueError(f"Expected at least 3 bands for quicklook, got {count} in {image_path}")

        rgb = src.read(list(idx)).astype(np.float32)  # (3, H, W)

    # Per-band robust scaling to improve visibility
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

    data_dir = _static_data_dir()
    out_dir = data_dir / "region_images"
    out_dir.mkdir(parents=True, exist_ok=True)
    safe = _safe_filename_segment(region_id)
    dst = out_dir / f"{safe}.png"
    pil.save(dst, format="PNG")
    return dst.relative_to(data_dir).as_posix()


def _predictions_mount_root() -> Path | None:
    raw = os.environ.get("SATRISK_PREDICTIONS_ROOT", "").strip()
    if raw:
        p = Path(raw)
        return p if p.is_dir() else None
    ds = _dataset_root_from_env()
    if ds is not None:
        nested = ds / "predictions"
        if nested.is_dir():
            return nested
    return None


def _safe_filename_segment(region_id: str) -> str:
    return region_id.replace("/", "_").replace("\\", "_")


def find_prediction_tif(*, predictions_root: Path, model: str, region_id: str) -> Path | None:
    """
    Locate a stored prediction GeoTIFF for ``region_id`` under ``predictions_root``.

    Tries, in order:

    * ``{root}/{model}/{region_id}.tif`` and ``{region_id}_PRED.tif``
    * ``{root}/predictions/{model}/…`` (same filenames)
    * Recursive search under ``{root}/{model}`` for exact filename matches
    * Recursive search for a unique ``*{region_id}*_PRED.tif`` under ``{root}/{model}``
    """
    model = model.lower().strip()
    exact_names = (f"{region_id}.tif", f"{region_id}_PRED.tif")

    bases = [
        predictions_root / model,
        predictions_root / "predictions" / model,
    ]

    for base in bases:
        if not base.is_dir():
            continue
        for name in exact_names:
            p = base / name
            if p.is_file():
                return p
        for name in exact_names:
            for p in base.rglob(name):
                if p.is_file():
                    return p
        for p in base.rglob("*.tif"):
            if not p.is_file():
                continue
            if p.stem == region_id or p.stem == f"{region_id}_PRED":
                return p

    base = predictions_root / model
    if base.is_dir():
        pred_suffix_matches = [p for p in base.rglob("*.tif") if region_id in p.name and "_PRED" in p.name]
        if len(pred_suffix_matches) == 1:
            return pred_suffix_matches[0]

    # Flat / nested trees (e.g. ``deeplab-prediction/test/...``) without a ``{model}`` prefix
    matches: list[Path] = []
    for p in predictions_root.rglob("*.tif"):
        if not p.is_file():
            continue
        if p.name in exact_names or p.stem in (region_id, f"{region_id}_PRED"):
            matches.append(p)
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        model_lo = model.lower()
        preferred = [p for p in matches if model_lo in p.as_posix().lower()]
        return preferred[0] if preferred else matches[0]

    return None


def _read_first_band(path: Path) -> np.ndarray:
    with rasterio.open(path) as src:
        arr = src.read(1)
    return np.asarray(arr, dtype=np.float32)


def _to_binary_hw(arr: np.ndarray) -> np.ndarray:
    a = np.asarray(arr)
    if a.ndim > 2:
        a = np.squeeze(a)
    if a.ndim != 2:
        raise ValueError(f"expected 2D mask, got shape {a.shape}")
    return (a > 0).astype(np.uint8)


def _resize_nearest_hw(arr: np.ndarray, size_hw: tuple[int, int]) -> np.ndarray:
    h, w = size_hw
    if arr.shape == (h, w):
        return arr
    try:
        resample = Image.Resampling.NEAREST
    except AttributeError:
        resample = Image.NEAREST  # type: ignore[attr-defined]
    img = Image.fromarray(arr.astype(np.uint8), mode="L")
    out = np.array(img.resize((w, h), resample), dtype=np.uint8)
    return out


def _iou_binary_same_shape(pred_b: np.ndarray, gt_b: np.ndarray) -> float:
    inter = int((pred_b & gt_b).sum())
    union = int(((pred_b | gt_b) > 0).sum())
    if union == 0:
        return 1.0
    return round(inter / union, 4)


def compute_binary_iou(pred: np.ndarray, gt: np.ndarray) -> float:
    pred_b = _to_binary_hw(pred)
    gt_b = _to_binary_hw(gt)
    if pred_b.shape != gt_b.shape:
        pred_b = _resize_nearest_hw(pred_b, gt_b.shape)
    return _iou_binary_same_shape(pred_b, gt_b)


def _mask_to_png_uint8(binary_hw: np.ndarray) -> Image.Image:
    vis = (binary_hw.astype(np.uint8) * 255)
    return Image.fromarray(vis, mode="L")


def export_aligned_masks_to_png(
    *,
    pred_b_hw: np.ndarray,
    gt_b_hw: np.ndarray,
    region_id: str,
    model: str,
) -> tuple[str, str]:
    """
    Write aligned binary masks (HxW, values 0/1) as PNGs under ``data/predictions`` and
    ``data/ground_truth``. Returns static-relative posix paths.
    """
    if pred_b_hw.shape != gt_b_hw.shape:
        raise ValueError("pred and gt must share shape before export")

    data_dir = _static_data_dir()
    pred_dir = data_dir / "predictions"
    gt_dir = data_dir / "ground_truth"
    pred_dir.mkdir(parents=True, exist_ok=True)
    gt_dir.mkdir(parents=True, exist_ok=True)

    safe = _safe_filename_segment(region_id)
    model_tag = model.lower().strip()
    pred_png = pred_dir / f"{safe}_{model_tag}.png"
    gt_png = gt_dir / f"{safe}.png"

    _mask_to_png_uint8(pred_b_hw).save(pred_png, format="PNG")
    _mask_to_png_uint8(gt_b_hw).save(gt_png, format="PNG")

    pred_rel = pred_png.relative_to(data_dir).as_posix()
    gt_rel = gt_png.relative_to(data_dir).as_posix()
    return pred_rel, gt_rel


def build_geotiff_prediction_result(
    region: DatasetRegion,
    *,
    model: str,
    dataset_root: Path,
) -> GeotiffPredictResult:
    pred_root = _predictions_mount_root()
    if pred_root is None:
        raise FileNotFoundError(
            "No predictions directory found. Set SATRISK_PREDICTIONS_ROOT to the folder "
            "that contains per-model prediction GeoTIFFs, or add a `predictions/` "
            "subdirectory under SATRISK_DATASET_ROOT.",
        )

    pred_tif = find_prediction_tif(
        predictions_root=pred_root.resolve(),
        model=model,
        region_id=region.id,
    )
    if pred_tif is None:
        raise FileNotFoundError(
            f"No prediction GeoTIFF for region_id={region.id!r} model={model!r} under {pred_root}",
        )

    gt_path = (dataset_root / region.mask_path).resolve()
    if not gt_path.is_file():
        raise FileNotFoundError(f"Ground truth mask not found: {gt_path}")

    pred = _read_first_band(pred_tif)
    gt = _read_first_band(gt_path)
    pred_b = _to_binary_hw(pred)
    gt_b = _to_binary_hw(gt)
    if pred_b.shape != gt_b.shape:
        pred_b = _resize_nearest_hw(pred_b, gt_b.shape)

    iou = _iou_binary_same_shape(pred_b, gt_b)
    pred_rel, gt_rel = export_aligned_masks_to_png(
        pred_b_hw=pred_b,
        gt_b_hw=gt_b,
        region_id=region.id,
        model=model,
    )
    return GeotiffPredictResult(mask_relpath=pred_rel, ground_truth_relpath=gt_rel, iou=iou)
