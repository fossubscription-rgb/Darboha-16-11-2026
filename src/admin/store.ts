import {
  SEED_ACTIVITY,
  SEED_FINANCE,
  SEED_MEMBERS,
  SEED_PLACES,
} from './mockData'
import type {
  ActivityItem,
  FinanceDraft,
  FinanceStatus,
  Member,
  Place,
  PlaceStatus,
} from './types'

const STORE_KEY = 'darboha-admin-store-v2'

export type AdminStore = {
  members: Member[]
  places: Place[]
  finance: FinanceDraft[]
  activity: ActivityItem[]
}

function seed(): AdminStore {
  return {
    members: structuredClone(SEED_MEMBERS),
    places: structuredClone(SEED_PLACES),
    finance: structuredClone(SEED_FINANCE),
    activity: structuredClone(SEED_ACTIVITY),
  }
}

export function loadStore(): AdminStore {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return seed()
    const parsed = JSON.parse(raw) as AdminStore
    if (!parsed.members?.length) return seed()
    return parsed
  } catch {
    return seed()
  }
}

export function saveStore(store: AdminStore) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
  } catch {
    /* ignore */
  }
}

export function resetStore(): AdminStore {
  const next = seed()
  saveStore(next)
  return next
}

export function pushActivity(
  store: AdminStore,
  actor: string,
  action: string,
  summary: string,
): AdminStore {
  const item: ActivityItem = {
    id: `a-${Date.now()}`,
    actor,
    action,
    summary,
    createdAt: new Date().toISOString(),
  }
  return { ...store, activity: [item, ...store.activity] }
}

export function upsertPlace(store: AdminStore, place: Place): AdminStore {
  const exists = store.places.some((p) => p.id === place.id)
  const places = exists
    ? store.places.map((p) => (p.id === place.id ? place : p))
    : [place, ...store.places]
  return { ...store, places }
}

export function deletePlace(store: AdminStore, id: string): AdminStore {
  return { ...store, places: store.places.filter((p) => p.id !== id) }
}

export function upsertFinance(
  store: AdminStore,
  draft: FinanceDraft,
): AdminStore {
  const exists = store.finance.some((f) => f.id === draft.id)
  const finance = exists
    ? store.finance.map((f) => (f.id === draft.id ? draft : f))
    : [draft, ...store.finance]
  return { ...store, finance }
}

export function setFinanceStatus(
  store: AdminStore,
  id: string,
  status: FinanceStatus,
): AdminStore {
  return {
    ...store,
    finance: store.finance.map((f) =>
      f.id === id ? { ...f, status, updatedAt: new Date().toISOString() } : f,
    ),
  }
}

export function setPlaceStatus(
  store: AdminStore,
  id: string,
  status: PlaceStatus,
): AdminStore {
  return {
    ...store,
    places: store.places.map((p) =>
      p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p,
    ),
  }
}

export function daCanSubmit(place: Place): string | null {
  if (!place.nameEn.trim() || !place.nameAr.trim())
    return 'Basics: English and Arabic names are required.'
  if (!place.summaryEn.trim() || !place.summaryAr.trim())
    return 'Basics: English and Arabic summaries are required.'
  if (!place.region.trim()) return 'Basics: region is required.'
  if (!place.difficulty) return 'Basics: difficulty is required.'
  if (!place.seasonFrom || !place.seasonTo)
    return 'Basics: season from → to months are required.'
  if (!place.vehicleAccess) return 'Access: vehicle type is required.'
  if (!place.accessNotesEn.trim() || !place.accessNotesAr.trim())
    return 'Access: English and Arabic notes are required.'
  if (place.photos.length < 2) return 'Photos: at least 2 photos required.'
  if (place.photos.length > 10) return 'Photos: maximum 10 photos.'
  if (!place.photos.some((p) => p.isCover))
    return 'Photos: mark one cover photo.'
  return null
}

export function safetyComplete(place: Place): string | null {
  const s = place.safety
  const fields: (keyof typeof s)[] = [
    'hazards',
    'heat',
    'flood',
    'water',
    'signal',
    'emergency',
    'whenNotToGo',
    'kit',
  ]
  for (const key of fields) {
    if (typeof s[key] === 'string' && !String(s[key]).trim()) {
      return `Safety: complete “${key}” before Ready.`
    }
  }
  return null
}
