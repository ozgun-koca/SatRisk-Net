import { useEffect, useState } from 'react'
import { DatasetMap } from '../components/DatasetMap'
import {
  fetchDatasetRegions,
  type DatasetRegionSummary,
} from '../services/datasets'

import styles from './DatasetMapPage.module.css'

export function DatasetMapPage() {
  const [regions, setRegions] = useState<DatasetRegionSummary[]>([])
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchDatasetRegions()
      .then((data) => {
        if (!cancelled) setRegions(data)
      })
      .catch(() => {
        if (!cancelled) setLoadError('Could not load dataset regions.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className={styles.page}>
      {loadError ? (
        <p className={styles.banner} role="status">
          {loadError}
        </p>
      ) : null}
      <DatasetMap
        regions={regions}
        selectedRegionId={selectedRegionId}
        onSelectRegion={setSelectedRegionId}
      />
    </div>
  )
}
