# SatRisk-Net

**Optimization of Neural Networks for Satellite Imagery–Based Disaster Risk Monitoring**

Wildfire burn-scar semantic segmentation from Sentinel-2 imagery — three architectures
benchmarked, optimized for low-power edge inference on NVIDIA Jetson Orin Nano, and served
through an interactive web interface.

**Live demo:** https://satrisk-net.vercel.app
**Demo video:** https://drive.google.com/file/d/1uj1tJDoTFeH48pcT2wwZlWkMvvSxKI_a/view

## Overview

We compare **U-Net**, **DeepLabV3+**, and **SegFormer-B0** for binary burn-scar segmentation on
two public Sentinel-2 datasets (Copernicus EMS and IBM–NASA HLS Burn Scars), show how to adapt and
recover a Transformer baseline on small multispectral data, and deploy the best model to edge
hardware with TensorRT.

## Key results (best test IoU)

| Dataset | Best model | Test IoU |
|---|---|---|
| CEMS (12-band) | U-Net | **0.8280** |
| HLS (6-band) | DeepLabV3+ | **0.8428** |

- Recovered a collapsed SegFormer-B0 baseline from **0.11 → ≥ 0.80 IoU** via patch-embedding
  surgery and transformer-appropriate fine-tuning.
- The best architecture is **dataset-size dependent** (U-Net on the smaller CEMS, DeepLabV3+ on the larger HLS).
- **Edge deployment:** aggressively-pruned U-Net (FP16 TensorRT) on Jetson Orin Nano @ 15 W →
  ~137 ms per 512×512 tile, ~19 img/s, under 6 W mean power.

Full methodology and results: [`report/SatRiskNet-Report.pdf`](report/SatRiskNet-Report.pdf).

## Repository structure

| Path | Description |
|---|---|
| `backend/` | FastAPI inference backend |
| `frontend/` | React + Leaflet web interface |
| `model-experiments/` | Training & evaluation notebooks (CEMS, HLS) |
| `report/` | Full project report (PDF) |
| `figures/` | Result figures and charts |
| `models/` | Model configuration files |

## Tech stack

PyTorch · segmentation-models-pytorch · HuggingFace Transformers · TensorRT · FastAPI · React · Leaflet

## Team — Satellite Imagery (2025–2026)

Advisor: Asst. Prof. Dr. Selma Dilek — Hacettepe University, Department of Computer Engineering

| Member | Profile |
|---|---|
| Emre Erdoğan | [GitHub](https://github.com/emreedgan) |
| Emre Yeğin | [GitHub](https://github.com/yeginemre) |
| Özgün Serergün Koca | [GitHub](https://github.com/ozgun-koca) |
| Mustafa Ege | [GitHub](https://github.com/mustafa-ege) |
| Kağan Canerik | [GitHub](https://github.com/KaganCanerik) |

## License

Released under the MIT License — see [`LICENSE`](LICENSE).
