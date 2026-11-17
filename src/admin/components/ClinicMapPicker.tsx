import { useEffect, useRef, useState } from 'react'

export type ClinicSelection = {
  nearestClinic: string
  nearestClinicPlaceId: string
  nearestClinicLat: number | null
  nearestClinicLng: number | null
  nearestClinicMapsUrl: string
}

type Props = {
  value: ClinicSelection
  disabled?: boolean
  onChange: (next: ClinicSelection) => void
}

const SCRIPT_ID = 'darboha-google-maps-js'
let mapsLoader: Promise<typeof google> | null = null

function mapsKey(): string {
  return (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim() || ''
}

function loadGoogleMaps(apiKey: string): Promise<typeof google> {
  if (typeof window !== 'undefined' && window.google?.maps?.places) {
    return Promise.resolve(window.google)
  }
  if (mapsLoader) return mapsLoader

  mapsLoader = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google))
      existing.addEventListener('error', () =>
        reject(new Error('Google Maps failed to load')),
      )
      return
    }
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.async = true
    script.defer = true
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&v=weekly`
    script.onload = () => resolve(window.google)
    script.onerror = () => reject(new Error('Google Maps failed to load'))
    document.head.appendChild(script)
  })
  return mapsLoader
}

function mapsSearchUrl(name: string, placeId: string, lat: number, lng: number) {
  if (placeId) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${encodeURIComponent(placeId)}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

export function ClinicMapPicker({ value, disabled, onChange }: Props) {
  const key = mapsKey()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    key ? 'loading' : 'idle',
  )
  const [error, setError] = useState<string | null>(null)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

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
        // Bias to Oman clinics/hospitals; establishment keeps Places Autocomplete happy.
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
            setError('Pick a clinic result from the Google suggestions list.')
            return
          }
          const lat = loc.lat()
          const lng = loc.lng()
          setError(null)
          onChangeRef.current({
            nearestClinic: name,
            nearestClinicPlaceId: placeId,
            nearestClinicLat: lat,
            nearestClinicLng: lng,
            nearestClinicMapsUrl:
              place.url || mapsSearchUrl(name, placeId, lat, lng),
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
  }, [key, disabled])

  const embedSrc =
    key && value.nearestClinicPlaceId
      ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=place_id:${encodeURIComponent(value.nearestClinicPlaceId)}`
      : key && value.nearestClinicLat != null && value.nearestClinicLng != null
        ? `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(key)}&center=${value.nearestClinicLat},${value.nearestClinicLng}&zoom=14`
        : key
          ? `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(key)}&center=23.5880,58.3829&zoom=7`
          : null

  function clearClinic() {
    onChange({
      nearestClinic: '',
      nearestClinicPlaceId: '',
      nearestClinicLat: null,
      nearestClinicLng: null,
      nearestClinicMapsUrl: '',
    })
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="admin-field full">
      <label>Nearest clinic (Google Maps — required)</label>
      <p className="admin-muted" style={{ margin: '0 0 0.55rem' }}>
        Search and pick a hospital / clinic on the map. Name, Place ID, coords,
        and Maps URL are saved.
      </p>

      {!key && (
        <div className="admin-banner" style={{ marginBottom: '0.65rem' }}>
          Set <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>.env.local</code>{' '}
          (Places + Maps Embed / JS API), then restart Vite.
        </div>
      )}

      <input
        ref={inputRef}
        type="text"
        disabled={disabled || !key || status === 'error'}
        placeholder={
          key
            ? 'Search clinics / hospitals in Oman…'
            : 'Maps key missing — cannot search'
        }
        defaultValue={value.nearestClinic}
        style={{
          width: '100%',
          border: '1px solid #d5e0d9',
          borderRadius: 8,
          padding: '0.45rem 0.6rem',
          marginBottom: '0.55rem',
        }}
      />

      {status === 'loading' && (
        <p className="admin-muted" style={{ margin: '0 0 0.55rem' }}>
          Loading Google Maps…
        </p>
      )}
      {error && <p className="admin-error">{error}</p>}

      {embedSrc && (
        <div
          style={{
            borderRadius: 10,
            overflow: 'hidden',
            border: '1px solid #d5e0d9',
            marginBottom: '0.55rem',
            background: '#e7f0ea',
          }}
        >
          <iframe
            title="Nearest clinic map"
            src={embedSrc}
            width="100%"
            height="260"
            style={{ border: 0, display: 'block' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      )}

      {value.nearestClinicPlaceId ? (
        <div className="admin-banner info" style={{ marginBottom: '0.55rem' }}>
          <strong>{value.nearestClinic}</strong>
          <div className="admin-muted" style={{ marginTop: 4 }}>
            Place ID: <code>{value.nearestClinicPlaceId}</code>
            {value.nearestClinicLat != null && value.nearestClinicLng != null
              ? ` · ${value.nearestClinicLat.toFixed(5)}, ${value.nearestClinicLng.toFixed(5)}`
              : ''}
          </div>
          {value.nearestClinicMapsUrl && (
            <a
              href={value.nearestClinicMapsUrl}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.85rem' }}
            >
              Open in Google Maps
            </a>
          )}
        </div>
      ) : (
        <p className="admin-muted" style={{ margin: '0 0 0.55rem' }}>
          No clinic selected yet.
        </p>
      )}

      {!disabled && value.nearestClinicPlaceId && (
        <button
          type="button"
          className="admin-btn secondary"
          onClick={clearClinic}
          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
        >
          Clear clinic
        </button>
      )}
    </div>
  )
}
