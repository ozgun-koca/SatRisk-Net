import { useState, useRef, useEffect } from 'react'
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
  regionId: string | null
  regionImageUrl: string | null
  predictionMaskUrl: string | null
  groundTruthMaskUrl: string | null
  onBack?: () => void
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
}

export function PredictionPanel({
  model,
  onModelChange,
  showGroundTruth,
  onShowGroundTruthChange,
  iou,
  loading,
  error,
  regionId,
  regionImageUrl,
  predictionMaskUrl,
  groundTruthMaskUrl,
  onBack,
  theme,
  setTheme,
}: PredictionPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const activeOption = MODEL_OPTIONS.find((opt) => opt.value === model) || MODEL_OPTIONS[0]

  return (
    <aside className={`${styles.panel} ${theme === 'dark' ? styles.dark : styles.light}`} aria-label="Prediction and metrics">
      <div className={styles.headerRow}>
        <div className={styles.navBlock}>
          {onBack ? (
            <button onClick={onBack} className={styles.backBtn} aria-label="Back to landing page">
              ← Home
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={styles.themeToggleBtn}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        <div className={styles.titleBlock}>
          <div className={styles.title}>Prediction</div>
          <div className={styles.subtitle}>
            {regionId ? `Region: ${regionId}` : 'Select a region'}
          </div>
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Model</span>
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <button
            type="button"
            className={`${styles.dropdownTrigger} ${loading ? styles.disabled : ''}`}
            onClick={() => !loading && setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            disabled={loading}
          >
            <div className={styles.triggerContent}>
              <span className={styles.optionLabel}>{activeOption.label}</span>
              <span className={`${styles.statusBadge} ${styles[activeOption.statusColor]}`}>
                {activeOption.statusText}
              </span>
            </div>
            <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>▼</span>
          </button>

          {isOpen && (
            <ul className={styles.dropdownMenu} role="listbox">
              {MODEL_OPTIONS.map((opt) => {
                const isSelected = opt.value === model
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    className={`${styles.dropdownItem} ${isSelected ? styles.selectedItem : ''}`}
                    onClick={() => {
                      onModelChange(opt.value)
                      setIsOpen(false)
                    }}
                  >
                    <span className={styles.itemLabel}>{opt.label}</span>
                    <span className={`${styles.statusBadge} ${styles[opt.statusColor]}`}>
                      {opt.statusText}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

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

      <div className={styles.previews} aria-label="Region previews">
        <section className={styles.previewSection}>
          <div className={styles.previewLabel}>Image + ground truth</div>
          <div className={styles.overlayFrame}>
            {regionImageUrl ? (
              <img className={styles.baseImage} src={regionImageUrl} alt="" />
            ) : (
              <div className={styles.placeholder}>No image</div>
            )}
            {groundTruthMaskUrl ? (
              <img
                className={styles.overlayImage}
                src={groundTruthMaskUrl}
                alt=""
              />
            ) : null}
          </div>
        </section>

        <div className={styles.maskPairRow}>
          <section className={styles.previewSection}>
            <div className={styles.previewLabel}>Prediction</div>
            <div className={styles.imageFrame}>
              {predictionMaskUrl ? (
                <img
                  className={styles.singleImage}
                  src={predictionMaskUrl}
                  alt=""
                />
              ) : (
                <div className={styles.placeholder}>—</div>
              )}
            </div>
          </section>
          <section className={styles.previewSection}>
            <div className={styles.previewLabel}>Ground truth</div>
            <div className={styles.imageFrame}>
              {groundTruthMaskUrl ? (
                <img
                  className={styles.singleImage}
                  src={groundTruthMaskUrl}
                  alt=""
                />
              ) : (
                <div className={styles.placeholder}>—</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </aside>
  )
}
