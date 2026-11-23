import type { Place } from './types'

export type AdminStore = {
  members: import('./types').Member[]
  places: Place[]
  finance: import('./types').FinanceDraft[]
  activity: import('./types').ActivityItem[]
}

export type RequiredProgress = {
  done: number
  total: number
  /** Stable keys under adminCopy.*.req */
  missing: string[]
  percent: number
}

/** Required DA fields before submit-for-safety. */
export function daRequiredProgress(place: Place): RequiredProgress {
  const checks: { key: string; ok: boolean }[] = [
    { key: 'nameEn', ok: !!place.nameEn.trim() },
    { key: 'nameAr', ok: !!place.nameAr.trim() },
    { key: 'summaryEn', ok: !!place.summaryEn.trim() },
    { key: 'summaryAr', ok: !!place.summaryAr.trim() },
    { key: 'region', ok: !!place.region.trim() },
    { key: 'difficulty', ok: !!place.difficulty },
    { key: 'seasonFrom', ok: !!place.seasonFrom },
    { key: 'seasonTo', ok: !!place.seasonTo },
    { key: 'hikeLength', ok: !!place.distanceKm.trim() },
    { key: 'estimatedTime', ok: !!place.durationText.trim() },
    {
      key: 'startPlaceMap',
      ok:
        !!place.startPlacePlaceId.trim() &&
        place.startPlaceLat != null &&
        place.startPlaceLng != null &&
        !!place.startPlaceMapsUrl.trim() &&
        !!place.startPlaceEn.trim() &&
        !!place.startPlaceAr.trim(),
    },
    {
      key: 'endPlaceMap',
      ok:
        !!place.endPlacePlaceId.trim() &&
        place.endPlaceLat != null &&
        place.endPlaceLng != null &&
        !!place.endPlaceMapsUrl.trim() &&
        !!place.endPlaceEn.trim() &&
        !!place.endPlaceAr.trim(),
    },
    { key: 'vehicleAccess', ok: !!place.vehicleAccess },
    { key: 'accessNotesEn', ok: !!place.accessNotesEn.trim() },
    { key: 'accessNotesAr', ok: !!place.accessNotesAr.trim() },
    {
      key: 'nearbyAmenities',
      ok:
        place.nearbyAmenities.some(
          (a) =>
            !!a.placeId.trim() &&
            a.lat != null &&
            a.lng != null &&
            !!a.mapsUrl.trim() &&
            (!!a.nameEn.trim() || !!a.nameAr.trim()),
        ) ||
        !!place.amenitiesNotesEn.trim() ||
        !!place.amenitiesNotesAr.trim(),
    },
    {
      key: 'photos',
      ok: place.photos.length >= 2 && place.photos.length <= 10,
    },
    { key: 'cover', ok: place.photos.some((p) => p.isCover) },
    {
      key: 'captions',
      ok:
        place.photos.length >= 2 &&
        place.photos.every(
          (p) => !!p.captionEn?.trim() && !!p.captionAr?.trim(),
        ),
    },
  ]
  const missing = checks.filter((c) => !c.ok).map((c) => c.key)
  const done = checks.length - missing.length
  return {
    done,
    total: checks.length,
    missing,
    percent: Math.round((done / checks.length) * 100),
  }
}

/** Returns missing requirement keys, or null if ready. */
export function daCanSubmit(place: Place): string[] | null {
  const progress = daRequiredProgress(place)
  if (progress.missing.length === 0) return null
  return progress.missing
}

export type SafetyBlocker =
  | { code: 'choose'; field: string }
  | { code: 'emergency' }
  | { code: 'clinic' }

export function safetyComplete(place: Place): SafetyBlocker | null {
  const s = place.safety
  const dropdownKeys: (keyof typeof s)[] = [
    'hazards',
    'heat',
    'flood',
    'water',
    'signal',
    'whenNotToGo',
    'kit',
  ]
  for (const key of dropdownKeys) {
    if (typeof s[key] === 'string' && !String(s[key]).trim()) {
      return { code: 'choose', field: String(key) }
    }
  }
  if (!s.emergencyContacts.trim()) {
    return { code: 'emergency' }
  }
  if (
    !s.nearestClinic.trim() ||
    !s.nearestClinicPlaceId.trim() ||
    s.nearestClinicLat == null ||
    s.nearestClinicLng == null ||
    !s.nearestClinicMapsUrl.trim()
  ) {
    return { code: 'clinic' }
  }
  return null
}

/** Ensure cover is first in the gallery array. */
export function sortPhotosCoverFirst<T extends { isCover: boolean }>(
  photos: T[],
): T[] {
  return [...photos].sort((a, b) => Number(b.isCover) - Number(a.isCover))
}
