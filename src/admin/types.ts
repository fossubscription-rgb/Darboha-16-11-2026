export type RoleKey = 'ceo' | 'da1' | 'da2' | 'safety' | 'cfo'

export type PlaceStatus =
  | 'draft'
  | 'awaiting_safety'
  | 'ready'
  | 'published'
  | 'rejected'
  | 'needs_changes'

export type VehicleAccess =
  | 'two_wd'
  | 'four_wd'
  | 'four_x4_recommended'
  | 'other'

export type FinanceStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected'

export type Member = {
  id: string
  roleKey: RoleKey | 'social'
  displayName: string
  jobTitle: string
  password: string
  isActive: boolean
  hasAdmin: boolean
  workedThisWeek: boolean
}

export type PlacePhoto = {
  id: string
  url: string
  isCover: boolean
  captionEn?: string
  captionAr?: string
}

/** Nearby amenity for offline hiking UX (cafe, shop, restroom, etc.). */
export type PlaceAmenity = {
  id: string
  kind: 'cafe' | 'shop' | 'restroom' | 'water' | 'parking' | 'other'
  nameEn: string
  nameAr: string
  /** Google Places pick (same pattern as nearest clinic). */
  placeId: string
  lat: number | null
  lng: number | null
  mapsUrl: string
  notesEn?: string
  notesAr?: string
}

export type Place = {
  id: string
  createdBy: string
  /** Display name of the creator (whose work this is). */
  ownerLabel: string
  /** Role key of the creator (da1/da2/ceo/…). */
  ownerRoleKey?: RoleKey | 'social' | string
  status: PlaceStatus
  nameEn: string
  nameAr: string
  summaryEn: string
  summaryAr: string
  region: string
  difficulty: string
  /** Season window: from-month → to-month (1–12). */
  seasonFrom: number | null
  seasonTo: number | null
  /** Hike length; numeric string, unit is always kilometres (km). */
  distanceKm: string
  /** Estimated hike time (free text, e.g. 3–5 hours). */
  durationText: string
  startPlaceEn: string
  startPlaceAr: string
  endPlaceEn: string
  endPlaceAr: string
  nearbyAmenities: PlaceAmenity[]
  amenitiesNotesEn: string
  amenitiesNotesAr: string
  fragile: boolean
  vehicleAccess: VehicleAccess
  accessNotesEn: string
  accessNotesAr: string
  trailheadNotesEn: string
  trailheadNotesAr: string
  photos: PlacePhoto[]
  safety: {
    /** Dropdown codes — see SAFETY_DROPDOWNS. */
    hazards: string
    heat: string
    flood: string
    water: string
    signal: string
    /** Legacy short emergency note (optional extra). */
    emergency: string
    whenNotToGo: string
    kit: string
    /** Required before Ready/Publish. */
    emergencyContacts: string
    /** Clinic display name from Google Places picker. */
    nearestClinic: string
    nearestClinicPlaceId: string
    nearestClinicLat: number | null
    nearestClinicLng: number | null
    nearestClinicMapsUrl: string
    notesEn: string
    notesAr: string
    completed: boolean
  }
  updatedAt: string
}

export type FinanceDraft = {
  id: string
  createdBy: string
  category: string
  whoFor: string
  description: string
  amountOmr: string
  status: FinanceStatus
  updatedAt: string
}

export type ActivityItem = {
  id: string
  actor: string
  action: string
  summary: string
  createdAt: string
}

export type Session = {
  memberId: string
  roleKey: RoleKey
  displayName: string
  /** Supabase admin_sessions token — bound to role for RLS + route AuthZ. */
  token: string
}
