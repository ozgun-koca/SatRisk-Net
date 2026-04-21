from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.datasets import DatasetRegion, _dataset_root_from_env, get_region
from app.services.geotiff_predictions import build_geotiff_prediction_result, export_region_quicklook_png
from app.services.predictions import deterministic_iou, prediction_relpath

router = APIRouter(tags=["predict"])


def _is_geotiff_dataset_region(region: DatasetRegion) -> bool:
    p = region.mask_path.lower()
    return p.endswith(".tif") or p.endswith(".tiff")


class PredictRequest(BaseModel):
    region_id: str = Field(..., min_length=1)
    model: str = Field(..., description="unet | deeplab | segformer")


class Metrics(BaseModel):
    iou: float


class PredictResponse(BaseModel):
    region_id: str
    mask_url: str
    ground_truth_url: str
    metrics: Metrics


@router.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest) -> PredictResponse:
    model = req.model.lower().strip()
    if model not in {"unet", "deeplab", "segformer"}:
        raise HTTPException(status_code=400, detail="Invalid model. Use: unet | deeplab | segformer")

    region = get_region(req.region_id)
    if region is None:
        raise HTTPException(status_code=404, detail="Unknown region_id")

    if _is_geotiff_dataset_region(region):
        root = _dataset_root_from_env()
        if root is None:
            raise HTTPException(
                status_code=500,
                detail="SATRISK_DATASET_ROOT is not set; cannot resolve ground truth GeoTIFF paths.",
            )
        try:
            # Create a stable preview image path the frontend can load directly.
            export_region_quicklook_png(image_path=(root / region.image_path).resolve(), region_id=region.id)
            result = build_geotiff_prediction_result(
                region,
                model=model,
                dataset_root=root,
            )
        except FileNotFoundError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc
        except ValueError as exc:
            raise HTTPException(status_code=500, detail=str(exc)) from exc

        return PredictResponse(
            region_id=region.id,
            mask_url=f"/static/{result.mask_relpath}",
            ground_truth_url=f"/static/{result.ground_truth_relpath}",
            metrics=Metrics(iou=result.iou),
        )

    pred_path = prediction_relpath(model=model, region=region)

    return PredictResponse(
        region_id=region.id,
        mask_url=f"/static/{pred_path}",
        ground_truth_url=f"/static/{region.mask_path}",
        metrics=Metrics(iou=deterministic_iou(model=model, region_id=region.id)),
    )

