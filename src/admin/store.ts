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
  missing: string[]
  percent: number
}

/** Required DA fields before submit-for-safety. */
export function daRequiredProgress(place: Place): RequiredProgress {
  const checks: { label: string; ok: boolean }[] = [
    { label: 'Name EN', ok: !!place.nameEn.trim() },
    { label: 'Name AR', ok: !!place.nameAr.trim() },
    { label: 'Summary EN', ok: !!place.summaryEn.trim() },
    { label: 'Summary AR', ok: !!place.summaryAr.trim() },
    { label: 'Region', ok: !!place.region.trim() },
    { label: 'Difficulty', ok: !!place.difficulty },
    { label: 'Season from', ok: !!place.seasonFrom },
    { label: 'Season to', ok: !!place.seasonTo },
    { label: 'Hike length (km)', ok: !!place.distanceKm.trim() },
    { label: 'Estimated time', ok: !!place.durationText.trim() },
    { label: 'Start place EN', ok: !!place.startPlaceEn.trim() },
    { label: 'Start place AR', ok: !!place.startPlaceAr.trim() },
    { label: 'End place EN', ok: !!place.endPlaceEn.trim() },
    { label: 'End place AR', ok: !!place.endPlaceAr.trim() },
    { label: 'Vehicle access', ok: !!place.vehicleAccess },
    { label: 'Access notes EN', ok: !!place.accessNotesEn.trim() },
    { label: 'Access notes AR', ok: !!place.accessNotesAr.trim() },
    {
      label: 'Nearby amenities',
      ok:
        place.nearbyAmenities.some((a) => a.nameEn.trim() || a.nameAr.trim()) ||
        !!place.amenitiesNotesEn.trim() ||
        !!place.amenitiesNotesAr.trim(),
    },
    { label: 'Photos (2–10)', ok: place.photos.length >= 2 && place.photos.length <= 10 },
    { label: 'Cover photo', ok: place.photos.some((p) => p.isCover) },
    {
      label: 'Photo captions EN+AR',
      ok:
        place.photos.length >= 2 &&
        place.photos.every((p) => !!p.captionEn?.trim() && !!p.captionAr?.trim()),
    },
  ]
  const missing = checks.filter((c) => !c.ok).map((c) => c.label)
  const done = checks.length - missing.length
  return {
    done,
    total: checks.length,
    missing,
    percent: Math.round((done / checks.length) * 100),
  }
}

export function daCanSubmit(place: Place): string | null {
  const progress = daRequiredProgress(place)
  if (progress.missing.length === 0) return null
  return `Still needed: ${progress.missing.slice(0, 4).join(', ')}${
    progress.missing.length > 4 ? '…' : ''
  }`
}

export function safetyComplete(place: Place): string | null {
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
      return `Safety: choose “${key}” before Ready.`
    }
  }
  if (!s.emergencyContacts.trim()) {
    return 'Safety: emergency contacts are required before Ready.'
  }
  if (!s.nearestClinic.trim()) {
    return 'Safety: nearest clinic is required before Ready.'
  }
  return null
}

/** Ensure cover is first in the gallery array. */
export function sortPhotosCoverFirst<T extends { isCover: boolean }>(
  photos: T[],
): T[] {
  return [...photos].sort((a, b) => Number(b.isCover) - Number(a.isCover))
}
