from pathlib import Path

from dotenv import load_dotenv

# Repo root `.env` (this file: backend/app/main.py -> parents[2])
load_dotenv(Path(__file__).resolve().parents[2] / ".env")

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.services.datasets import _dataset_root_from_env


def create_app() -> FastAPI:
    app = FastAPI(title="satrisk-net backend", version="0.1.0")
    app.include_router(api_router, prefix="/api")
    static_dir = Path(__file__).resolve().parent / "data"
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

    dataset_root = _dataset_root_from_env()
    if dataset_root is not None:
        app.mount(
            "/dataset",
            StaticFiles(directory=str(dataset_root.resolve())),
            name="dataset",
        )
    return app


app = create_app()

