import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  OMAN_CENTER,
  reverseOsmPlace,
  searchOsmPlaces,
  type OsmPlace,
} from '../../lib/osmPlaces'

// Fix default marker icons under Vite bundling
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

export type OsmSelection = {
  name: string
  placeId: string
  lat: number | null
  lng: number | null
  mapsUrl: string
}

type Props = {
  label: string
  hint?: string
  searchPlaceholder?: string
  value: OsmSelection
  disabled?: boolean
  mapHeight?: number
  onChange: (next: OsmSelection) => void
  onClear?: () => void
}

function toSelection(p: OsmPlace): OsmSelection {
  return {
    name: p.name,
    placeId: p.placeId,
    lat: p.lat,
    lng: p.lng,
    mapsUrl: p.mapsUrl,
  }
}

export function OsmPlacePicker({
  label,
  hint,
  searchPlaceholder = 'Search OpenStreetMap…',
  value,
  disabled,
  mapHeight = 240,
  onChange,
  onClear,
}: Props) {
  const mapEl = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [query, setQuery] = useState(value.name || '')
  const [results, setResults] = useState<OsmPlace[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Init map once
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return
    const center: L.LatLngExpression =
      value.lat != null && value.lng != null
        ? [value.lat, value.lng]
        : [OMAN_CENTER.lat, OMAN_CENTER.lng]
    const map = L.map(mapEl.current, {
      center,
      zoom: value.lat != null ? 14 : 7,
      scrollWheelZoom: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (disabled) return
      const { lat, lng } = e.latlng
      setBusy(true)
      setError(null)
      void reverseOsmPlace(lat, lng)
        .then((place) => {
          if (!place) {
            setError('No place found at that point — try search.')
            return
          }
          const next = toSelection(place)
          setQuery(place.name)
          setResults([])
          onChangeRef.current(next)
        })
        .catch((err) =>
          setError(err instanceof Error ? err.message : 'Reverse geocode failed'),
        )
        .finally(() => setBusy(false))
    })

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // intentionally once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync marker / view when value changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (value.lat == null || value.lng == null) {
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
        markerRef.current = null
      }
      return
    }
    const latlng: L.LatLngExpression = [value.lat, value.lng]
    if (!markerRef.current) {
      markerRef.current = L.marker(latlng).addTo(map)
    } else {
      markerRef.current.setLatLng(latlng)
    }
    markerRef.current.bindPopup(value.name || 'Selected place')
    map.setView(latlng, Math.max(map.getZoom(), 14))
  }, [value.lat, value.lng, value.name])

  // Debounced Nominatim search
  useEffect(() => {
    if (disabled) return
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      return
    }
    // Don't re-search if query matches selected name
    if (value.placeId && q === value.name) {
      setResults([])
      return
    }
    const t = window.setTimeout(() => {
      setBusy(true)
      setError(null)
      void searchOsmPlaces(q)
        .then(setResults)
        .catch((err) =>
          setError(err instanceof Error ? err.message : 'Search failed'),
        )
        .finally(() => setBusy(false))
    }, 450)
    return () => window.clearTimeout(t)
  }, [query, disabled, value.placeId, value.name])

  function pick(place: OsmPlace) {
    const next = toSelection(place)
    setQuery(place.name)
    setResults([])
    onChange(next)
  }

  function clear() {
    setQuery('')
    setResults([])
    setError(null)
    onChange({
      name: '',
      placeId: '',
      lat: null,
      lng: null,
      mapsUrl: '',
    })
    onClear?.()
  }

  return (
    <div className="admin-field full">
      <label>{label}</label>
      {hint ? (
        <p className="admin-muted" style={{ margin: '0 0 0.55rem' }}>
          {hint}
        </p>
      ) : null}

      <input
        type="search"
        value={query}
        disabled={disabled}
        placeholder={searchPlaceholder}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          border: '1px solid #d5e0d9',
          borderRadius: 8,
          padding: '0.45rem 0.6rem',
          marginBottom: '0.45rem',
        }}
      />

      {busy && (
        <p className="admin-muted" style={{ margin: '0 0 0.45rem' }}>
          Searching OpenStreetMap…
        </p>
      )}
      {error && <p className="admin-error">{error}</p>}

      {results.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            margin: '0 0 0.55rem',
            padding: 0,
            border: '1px solid #d5e0d9',
            borderRadius: 8,
            maxHeight: 160,
            overflow: 'auto',
            background: '#fff',
          }}
        >
          {results.map((r) => (
            <li key={r.placeId}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => pick(r)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  border: 0,
                  borderBottom: '1px solid #eef3f0',
                  background: 'transparent',
                  padding: '0.5rem 0.65rem',
                  cursor: 'pointer',
                  font: 'inherit',
                }}
              >
                <strong style={{ display: 'block', fontSize: '0.9rem' }}>
                  {r.name}
                </strong>
                <span className="admin-muted" style={{ fontSize: '0.78rem' }}>
                  {r.displayName}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        ref={mapEl}
        style={{
          height: mapHeight,
          borderRadius: 10,
          border: '1px solid #d5e0d9',
          marginBottom: '0.55rem',
          zIndex: 0,
        }}
      />
      <p className="admin-muted" style={{ margin: '0 0 0.55rem', fontSize: '0.78rem' }}>
        Search Nominatim results, or click the map to reverse-geocode a point
        (Oman-biased). Free OSM tiles — no API key.
      </p>

      {value.placeId ? (
        <div className="admin-banner info" style={{ marginBottom: '0.55rem' }}>
          <strong>{value.name}</strong>
          <div className="admin-muted" style={{ marginTop: 4 }}>
            Place ID: <code>{value.placeId}</code>
            {value.lat != null && value.lng != null
              ? ` · ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}`
              : ''}
          </div>
          {value.mapsUrl ? (
            <a
              href={value.mapsUrl}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.85rem' }}
            >
              Open in OpenStreetMap
            </a>
          ) : null}
        </div>
      ) : (
        <p className="admin-muted" style={{ margin: '0 0 0.55rem' }}>
          No place selected yet.
        </p>
      )}

      {!disabled && value.placeId ? (
        <button
          type="button"
          className="admin-btn secondary"
          onClick={clear}
          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
        >
          Clear place
        </button>
      ) : null}
    </div>
  )
}
