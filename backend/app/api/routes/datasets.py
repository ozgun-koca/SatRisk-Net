from fastapi import APIRouter
from pydantic import BaseModel

from app.services.datasets import list_regions

router = APIRouter(tags=["datasets"])


class DatasetRegionSummary(BaseModel):
    id: str
    bbox: tuple[float, float, float, float]


@router.get("/datasets", response_model=list[DatasetRegionSummary])
def get_datasets() -> list[DatasetRegionSummary]:
    regions = list_regions()
    return [DatasetRegionSummary(id=r.id, bbox=r.bbox) for r in regions]

