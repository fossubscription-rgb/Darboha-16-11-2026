/** Free OpenStreetMap / Nominatim helpers (no API key). */

export type OsmPlace = {
  name: string
  placeId: string
  lat: number
  lng: number
  mapsUrl: string
  displayName: string
}

type NominatimResult = {
  place_id: number
  osm_type: 'node' | 'way' | 'relation'
  osm_id: number
  lat: string
  lon: string
  display_name: string
  name?: string
  type?: string
  class?: string
}

const USER_AGENT = 'DarbohaAdmin/1.0 (school project; contact: darboha)'

/** Oman-ish default map center. */
export const OMAN_CENTER = { lat: 23.588, lng: 58.3829 }

function osmPlaceId(r: NominatimResult): string {
  return `${r.osm_type}/${r.osm_id}`
}

function osmMapsUrl(r: NominatimResult): string {
  return `https://www.openstreetmap.org/${r.osm_type}/${r.osm_id}`
}

function toPlace(r: NominatimResult): OsmPlace {
  const lat = Number(r.lat)
  const lng = Number(r.lon)
  const name = (r.name || r.display_name.split(',')[0] || 'Place').trim()
  return {
    name,
    placeId: osmPlaceId(r),
    lat,
    lng,
    mapsUrl: osmMapsUrl(r),
    displayName: r.display_name,
  }
}

async function nominatimFetch(url: string): Promise<NominatimResult[]> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': USER_AGENT,
    },
  })
  if (!res.ok) throw new Error(`Nominatim error ${res.status}`)
  return (await res.json()) as NominatimResult[]
}

export async function searchOsmPlaces(
  query: string,
  opts?: { limit?: number; countrycodes?: string },
): Promise<OsmPlace[]> {
  const q = query.trim()
  if (q.length < 2) return []
  const params = new URLSearchParams({
    q,
    format: 'json',
    addressdetails: '0',
    limit: String(opts?.limit ?? 6),
    countrycodes: opts?.countrycodes ?? 'om',
  })
  const rows = await nominatimFetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
  )
  return rows.map(toPlace)
}

export async function reverseOsmPlace(
  lat: number,
  lng: number,
): Promise<OsmPlace | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    zoom: '18',
  })
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
    {
      headers: {
        Accept: 'application/json',
        'User-Agent': USER_AGENT,
      },
    },
  )
  if (!res.ok) throw new Error(`Nominatim reverse error ${res.status}`)
  const row = (await res.json()) as NominatimResult & { error?: string }
  if (row.error || !row.osm_id) return null
  return toPlace(row)
}

export function markerMapsUrl(lat: number, lng: number, name?: string) {
  const label = name ? encodeURIComponent(name) : `${lat},${lng}`
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}&marker=${label}`
}
