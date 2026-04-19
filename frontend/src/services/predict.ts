/** Matches backend `PredictRequest` / `PredictResponse`. */

export type PredictModel = 'unet' | 'deeplab' | 'segformer'

export type PredictRequestBody = {
  region_id: string
  model: PredictModel
}

export type PredictResponse = {
  region_id: string
  mask_url: string
  ground_truth_url: string
  metrics: {
    iou: number
  }
}

const PREDICT_URL = '/api/predict'

export async function postPredict(
  body: PredictRequestBody,
): Promise<PredictResponse> {
  const res = await fetch(PREDICT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(
      detail ? `Prediction failed (${res.status}): ${detail}` : `Prediction failed (${res.status})`,
    )
  }
  return res.json() as Promise<PredictResponse>
}

export const MODEL_OPTIONS: { value: PredictModel; label: string }[] = [
  { value: 'unet', label: 'U-Net' },
  { value: 'deeplab', label: 'DeepLabV3+' },
  { value: 'segformer', label: 'SegFormer' },
]
