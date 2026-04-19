import { useEffect } from 'react'
import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet'
import L from 'leaflet'
import {
  ImageOverlay,
  MapContainer,
  Polygon,
  TileLayer,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { DatasetRegionSummary } from '../services/datasets'

import styles from './DatasetMap.module.css'

function bboxToRectangleLatLngs(
  bbox: DatasetRegionSummary['bbox'],
): LatLngExpression[] {
  const [minLon, minLat, maxLon, maxLat] = bbox
  return [
    [minLat, minLon],
    [minLat, maxLon],
    [maxLat, maxLon],
    [maxLat, minLon],
  ]
}

function bboxToOverlayBounds(
  bbox: DatasetRegionSummary['bbox'],
): LatLngBoundsExpression {
  const [minLon, minLat, maxLon, maxLat] = bbox
  return [
    [minLat, minLon],
    [maxLat, maxLon],
  ]
}

function regionsToBounds(regions: DatasetRegionSummary[]): LatLngBoundsExpression | null {
  if (regions.length === 0) return null
  const bounds = L.latLngBounds([])
  for (const r of regions) {
    const [minLon, minLat, maxLon, maxLat] = r.bbox
    bounds.extend(L.latLngBounds(
      [minLat, minLon],
      [maxLat, maxLon],
    ))
  }
  return bounds
}

function FitBounds({ regions }: { regions: DatasetRegionSummary[] }) {
  const map = useMap()
  useEffect(() => {
    const bounds = regionsToBounds(regions)
    if (bounds) {
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 12 })
    }
  }, [map, regions])
  return null
}

type DatasetMapProps = {
  regions: DatasetRegionSummary[]
  selectedRegionId: string | null
  onSelectRegion: (id: string) => void
  overlayBbox: DatasetRegionSummary['bbox'] | null
  predictionOverlayUrl: string | null
  groundTruthOverlayUrl: string | null
  showGroundTruthOverlay: boolean
}

const DEFAULT_CENTER: LatLngExpression = [37.1, 27.3]
const DEFAULT_ZOOM = 9

export function DatasetMap({
  regions,
  selectedRegionId,
  onSelectRegion,
  overlayBbox,
  predictionOverlayUrl,
  groundTruthOverlayUrl,
  showGroundTruthOverlay,
}: DatasetMapProps) {
  const maskBounds =
    overlayBbox !== null ? bboxToOverlayBounds(overlayBbox) : null

  return (
    <MapContainer
      className={styles.map}
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds regions={regions} />
      {maskBounds && predictionOverlayUrl ? (
        <ImageOverlay
          url={predictionOverlayUrl}
          bounds={maskBounds}
          opacity={showGroundTruthOverlay ? 0.48 : 0.55}
          interactive={false}
        />
      ) : null}
      {maskBounds && showGroundTruthOverlay && groundTruthOverlayUrl ? (
        <ImageOverlay
          url={groundTruthOverlayUrl}
          bounds={maskBounds}
          opacity={0.42}
          interactive={false}
        />
      ) : null}
      {regions.map((region) => {
        const selected = region.id === selectedRegionId
        return (
          <Polygon
            key={region.id}
            positions={bboxToRectangleLatLngs(region.bbox)}
            pathOptions={{
              color: selected ? '#0284c7' : '#64748b',
              weight: selected ? 4 : 2,
              fillColor: selected ? '#0ea5e9' : '#94a3b8',
              fillOpacity: selected ? 0.38 : 0.22,
            }}
            eventHandlers={{
              click: () => {
                onSelectRegion(region.id)
              },
            }}
          />
        )
      })}
    </MapContainer>
  )
}
