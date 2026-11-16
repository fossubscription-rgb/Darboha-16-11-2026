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

export type Place = {
  id: string
  createdBy: string
  ownerLabel: string
  status: PlaceStatus
  nameEn: string
  nameAr: string
  summaryEn: string
  summaryAr: string
  region: string
  difficulty: string
  seasonEn: string
  seasonAr: string
  distanceKm: string
  durationText: string
  fragile: boolean
  vehicleAccess: VehicleAccess
  accessNotesEn: string
  accessNotesAr: string
  trailheadNotesEn: string
  trailheadNotesAr: string
  photos: PlacePhoto[]
  safety: {
    hazards: string
    heat: string
    flood: string
    water: string
    signal: string
    emergency: string
    whenNotToGo: string
    kit: string
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
}
