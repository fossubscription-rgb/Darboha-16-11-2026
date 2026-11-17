import { useEffect, useRef, useState } from 'react'
import {
  googleMapsApiKey,
  loadGoogleMaps,
  mapsEmbedSrc,
  mapsSearchUrl,
} from '../../lib/googleMaps'
import type { PlaceAmenity } from '../types'

type Props = {
  value: PlaceAmenity
  disabled?: boolean
  onChange: (next: PlaceAmenity) => void
  onRemove?: () => void
  kindOptions: { value: PlaceAmenity['kind']; label: string }[]
}

export function AmenityMapPicker({
  value,
  disabled,
  onChange,
  onRemove,
  kindOptions,
}: Props) {
  const key = googleMapsApiKey()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    key ? 'loading' : 'idle',
  )
  const [error, setError] = useState<string | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const valueRef = useRef(value)
  valueRef.current = value

  useEffect(() => {
    if (!key || disabled) {
      setStatus('idle')
      return
    }
    let cancelled = false
    setStatus('loading')
    setError(null)
    void loadGoogleMaps(key)
      .then((g) => {
        if (cancelled || !inputRef.current) return
        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current)
        }
        const ac = new g.maps.places.Autocomplete(inputRef.current, {
          fields: ['place_id', 'name', 'geometry', 'formatted_address', 'url'],
          types: ['establishment'],
          componentRestrictions: { country: 'om' },
        })
        ac.addListener('place_changed', () => {
          const place = ac.getPlace()
          const loc = place.geometry?.location
          const placeId = place.place_id || ''
          const name =
            place.name ||
            place.formatted_address ||
            inputRef.current?.value ||
            ''
          if (!placeId || !loc || !name) {
            setError('Pick a place from the Google suggestions list.')
            return
          }
          const lat = loc.lat()
          const lng = loc.lng()
          const current = valueRef.current
          setError(null)
          onChangeRef.current({
            ...current,
            nameEn: name,
            nameAr: current.nameAr || name,
            placeId,
            lat,
            lng,
            mapsUrl: place.url || mapsSearchUrl(name, placeId, lat, lng),
          })
        })
        autocompleteRef.current = ac
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Maps load failed')
      })
    return () => {
      cancelled = true
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
    }
  }, [key, disabled, value.id])

  const embedSrc = key
    ? mapsEmbedSrc(key, value.placeId, value.lat, value.lng)
    : null

  function clearPlace() {
    onChange({
      ...value,
      nameEn: '',
      placeId: '',
      lat: null,
      lng: null,
      mapsUrl: '',
    })
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div
      className="admin-form-grid"
      style={{
        marginBottom: '0.85rem',
        paddingBottom: '0.85rem',
        borderBottom: '1px solid #e2ebe5',
      }}
    >
      <div className="admin-field">
        <label>Kind</label>
        <select
          value={value.kind}
          disabled={disabled}
          onChange={(e) =>
            onChange({
              ...value,
              kind: e.target.value as PlaceAmenity['kind'],
            })
          }
        >
          {kindOptions.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-field">
        <label>&nbsp;</label>
        {disabled ? null : (
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {value.placeId ? (
              <button
                type="button"
                className="admin-btn secondary"
                style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                onClick={clearPlace}
              >
                Clear place
              </button>
            ) : null}
            {onRemove ? (
              <button
                type="button"
                className="admin-btn danger"
                style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                onClick={onRemove}
              >
                Remove
              </button>
            ) : null}
          </div>
        )}
      </div>

      <div className="admin-field full">
        <label>Google Maps place (cafe / shop / service)</label>
        {!key && (
          <div className="admin-banner" style={{ marginBottom: '0.45rem' }}>
            Set <code>VITE_GOOGLE_MAPS_API_KEY</code> to search amenities.
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          disabled={disabled || !key || status === 'error'}
          placeholder={
            key
              ? 'Search coffee shops / amenities in Oman…'
              : 'Maps key missing — cannot search'
          }
          defaultValue={value.nameEn}
          key={`${value.id}-${value.placeId || 'empty'}`}
          style={{
            width: '100%',
            border: '1px solid #d5e0d9',
            borderRadius: 8,
            padding: '0.45rem 0.6rem',
            marginBottom: '0.45rem',
          }}
        />
        {status === 'loading' && (
          <p className="admin-muted" style={{ margin: '0 0 0.45rem' }}>
            Loading Google Maps…
          </p>
        )}
        {error && <p className="admin-error">{error}</p>}
      </div>

      {embedSrc && value.placeId ? (
        <div className="admin-field full">
          <div
            style={{
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px solid #d5e0d9',
              background: '#e7f0ea',
            }}
          >
            <iframe
              title={`Amenity map ${value.nameEn || value.id}`}
              src={embedSrc}
              width="100%"
              height="200"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}

      {value.placeId ? (
        <div className="admin-field full">
          <div className="admin-banner info" style={{ marginBottom: 0 }}>
            <strong>{value.nameEn}</strong>
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
                Open in Google Maps
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="admin-field">
        <label>Name (EN)</label>
        <input
          value={value.nameEn}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, nameEn: e.target.value })}
        />
      </div>
      <div className="admin-field">
        <label>الاسم (AR)</label>
        <input
          dir="rtl"
          value={value.nameAr}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, nameAr: e.target.value })}
        />
      </div>
    </div>
  )
}
