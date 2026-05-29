# Models Directory

This directory is designated for storing trained deep learning model weight checkpoints (`.pth` / `.pt`) and their corresponding YAML configuration files.

> [!IMPORTANT]
> Heavy model weight files (`*.pth`) are ignored globally by Git in `.gitignore` to keep the repository lightweight. You must download or copy the checkpoints and place them in this directory before running live inference.

## Required Structure

To enable live inference in the FastAPI backend, place your model checkpoints and configurations in this folder using the following naming convention:

```
models/
├── deeplabv3.yaml       # Configuration describing the model structure and preprocessing
└── deeplabv3.pth   # PyTorch state_dict checkpoint weights (moved from training artifacts)
```

## Adding New Models

If you train a new model (e.g., a UNet) and want to support it:
1. Export your trained PyTorch state dict as `models/unet.pth`.
2. Save its model configuration as `models/unet.yaml` (specifying channels, backbone, etc.).
3. The prediction API router will automatically detect the new checkpoint/configuration and enable real-time dynamic inference fallback on the frontend!
