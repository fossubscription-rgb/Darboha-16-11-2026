const SCRIPT_ID = 'darboha-google-maps-js'
let mapsLoader: Promise<typeof google> | null = null

export function googleMapsApiKey(): string {
  return (
    (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim() ||
    ''
  )
}

export function loadGoogleMaps(apiKey: string): Promise<typeof google> {
  if (typeof window !== 'undefined' && window.google?.maps?.places) {
    return Promise.resolve(window.google)
  }
  if (mapsLoader) return mapsLoader

  mapsLoader = new Promise((resolve, reject) => {
    const existing = document.getElementById(
      SCRIPT_ID,
    ) as HTMLScriptElement | null
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

export function mapsSearchUrl(
  name: string,
  placeId: string,
  lat: number,
  lng: number,
) {
  if (placeId) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${encodeURIComponent(placeId)}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

export function mapsEmbedSrc(
  key: string,
  placeId: string,
  lat: number | null,
  lng: number | null,
  fallbackCenter = '23.5880,58.3829',
) {
  if (placeId) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=place_id:${encodeURIComponent(placeId)}`
  }
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(key)}&center=${lat},${lng}&zoom=14`
  }
  return `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(key)}&center=${fallbackCenter}&zoom=7`
}

export type PlacesPick = {
  name: string
  placeId: string
  lat: number
  lng: number
  mapsUrl: string
}
