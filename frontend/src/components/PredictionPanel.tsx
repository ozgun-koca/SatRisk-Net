import {
  MODEL_OPTIONS,
  type PredictModel,
} from '../services/predict'

import styles from './PredictionPanel.module.css'

type PredictionPanelProps = {
  model: PredictModel
  onModelChange: (model: PredictModel) => void
  showGroundTruth: boolean
  onShowGroundTruthChange: (show: boolean) => void
  iou: number | null
  loading: boolean
  error: string | null
}

export function PredictionPanel({
  model,
  onModelChange,
  showGroundTruth,
  onShowGroundTruthChange,
  iou,
  loading,
  error,
}: PredictionPanelProps) {
  return (
    <aside className={styles.panel} aria-label="Prediction and metrics">
      <label className={styles.field}>
        <span className={styles.label}>Model</span>
        <select
          className={styles.select}
          value={model}
          onChange={(e) => onModelChange(e.target.value as PredictModel)}
          disabled={loading}
        >
          {MODEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={showGroundTruth}
          onChange={(e) => onShowGroundTruthChange(e.target.checked)}
        />
        <span>Show ground truth overlay</span>
      </label>

      <div className={styles.metrics}>
        <span className={styles.metricLabel}>IoU</span>
        <span className={styles.metricValue}>
          {loading && iou === null
            ? '…'
            : iou !== null
              ? iou.toFixed(4)
              : '—'}
        </span>
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </aside>
  )
}
