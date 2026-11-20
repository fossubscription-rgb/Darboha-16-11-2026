import { getAdminToken, setAdminToken, supabase } from '../lib/supabase'
import { sortPhotosCoverFirst } from './store'
import type {
  ActivityItem,
  FinanceDraft,
  FinanceStatus,
  Member,
  Place,
  PlaceAmenity,
  PlacePhoto,
  PlaceStatus,
  RoleKey,
  Session,
  VehicleAccess,
} from './types'

export type WaitlistRow = {
  id: string
  email: string
  createdAt: string
}

export type AdminBundle = {
  members: Member[]
  places: Place[]
  finance: FinanceDraft[]
  activity: ActivityItem[]
  waitlist: WaitlistRow[]
}

type PlaceRow = {
  id: string
  created_by: string
  status: PlaceStatus
  name_en: string
  name_ar: string
  summary_en: string
  summary_ar: string
  region: string
  difficulty: string
  season_from: number | null
  season_to: number | null
  distance_km: string
  duration_text: string
  start_place_en: string
  start_place_ar: string
  end_place_en: string
  end_place_ar: string
  nearby_amenities: PlaceAmenity[] | null
  amenities_notes_en: string
  amenities_notes_ar: string
  fragile: boolean
  vehicle_access: VehicleAccess
  access_notes_en: string
  access_notes_ar: string
  trailhead_notes_en: string
  trailhead_notes_ar: string
  photos: PlacePhoto[] | null
  updated_at: string
  team_roles?:
    | { display_name: string }
    | { display_name: string }[]
    | null
  place_safety?:
    | {
        hazards: string
        heat: string
        flood: string
        water: string
        signal: string
        emergency: string
        when_not_to_go: string
        kit: string
        emergency_contacts: string
        nearest_clinic: string
        nearest_clinic_place_id: string
        nearest_clinic_lat: number | null
        nearest_clinic_lng: number | null
        nearest_clinic_maps_url: string
        notes_en: string
        notes_ar: string
        completed: boolean
      }
    | {
        hazards: string
        heat: string
        flood: string
        water: string
        signal: string
        emergency: string
        when_not_to_go: string
        kit: string
        emergency_contacts: string
        nearest_clinic: string
        nearest_clinic_place_id: string
        nearest_clinic_lat: number | null
        nearest_clinic_lng: number | null
        nearest_clinic_maps_url: string
        notes_en: string
        notes_ar: string
        completed: boolean
      }[]
    | null
}

type MemberRow = {
  id: string
  role_key: RoleKey | 'social'
  display_name: string
  job_title: string
  is_active: boolean
  has_admin: boolean
  worked_this_week: boolean
}

type FinanceRow = {
  id: string
  created_by: string
  category: string
  who_for: string
  description: string
  amount_omr: string
  status: FinanceStatus
  updated_at: string
}

type ActivityRow = {
  id: string
  actor_label: string
  action: string
  summary: string
  created_at: string
}

function requireClient() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }
  return supabase
}

function mapPlace(row: PlaceRow): Place {
  const safetyRaw = row.place_safety
  const safety = Array.isArray(safetyRaw) ? safetyRaw[0] : safetyRaw
  const ownerRaw = row.team_roles
  const owner = Array.isArray(ownerRaw) ? ownerRaw[0] : ownerRaw
  return {
    id: row.id,
    createdBy: row.created_by,
    ownerLabel: owner?.display_name ?? 'Teammate',
    status: row.status,
    nameEn: row.name_en,
    nameAr: row.name_ar,
    summaryEn: row.summary_en,
    summaryAr: row.summary_ar,
    region: row.region,
    difficulty: row.difficulty,
    seasonFrom: row.season_from,
    seasonTo: row.season_to,
    distanceKm: row.distance_km,
    durationText: row.duration_text,
    startPlaceEn: row.start_place_en ?? '',
    startPlaceAr: row.start_place_ar ?? '',
    endPlaceEn: row.end_place_en ?? '',
    endPlaceAr: row.end_place_ar ?? '',
    nearbyAmenities: Array.isArray(row.nearby_amenities)
      ? row.nearby_amenities.map((a) => ({
          id: a.id || crypto.randomUUID(),
          kind: a.kind || 'other',
          nameEn: a.nameEn || '',
          nameAr: a.nameAr || '',
          placeId: a.placeId || '',
          lat: typeof a.lat === 'number' ? a.lat : null,
          lng: typeof a.lng === 'number' ? a.lng : null,
          mapsUrl: a.mapsUrl || '',
          notesEn: a.notesEn,
          notesAr: a.notesAr,
        }))
      : [],
    amenitiesNotesEn: row.amenities_notes_en ?? '',
    amenitiesNotesAr: row.amenities_notes_ar ?? '',
    fragile: row.fragile,
    vehicleAccess: row.vehicle_access,
    accessNotesEn: row.access_notes_en,
    accessNotesAr: row.access_notes_ar,
    trailheadNotesEn: row.trailhead_notes_en,
    trailheadNotesAr: row.trailhead_notes_ar,
    photos: sortPhotosCoverFirst(
      Array.isArray(row.photos) ? row.photos : [],
    ),
    safety: {
      hazards: safety?.hazards ?? '',
      heat: safety?.heat ?? '',
      flood: safety?.flood ?? '',
      water: safety?.water ?? '',
      signal: safety?.signal ?? '',
      emergency: safety?.emergency ?? '',
      whenNotToGo: safety?.when_not_to_go ?? '',
      kit: safety?.kit ?? '',
      emergencyContacts: safety?.emergency_contacts ?? '',
      nearestClinic: safety?.nearest_clinic ?? '',
      nearestClinicPlaceId: safety?.nearest_clinic_place_id ?? '',
      nearestClinicLat:
        typeof safety?.nearest_clinic_lat === 'number'
          ? safety.nearest_clinic_lat
          : null,
      nearestClinicLng:
        typeof safety?.nearest_clinic_lng === 'number'
          ? safety.nearest_clinic_lng
          : null,
      nearestClinicMapsUrl: safety?.nearest_clinic_maps_url ?? '',
      notesEn: safety?.notes_en ?? '',
      notesAr: safety?.notes_ar ?? '',
      completed: safety?.completed ?? false,
    },
    updatedAt: row.updated_at,
  }
}

function placeToRow(place: Place) {
  return {
    id: place.id,
    created_by: place.createdBy,
    status: place.status,
    name_en: place.nameEn,
    name_ar: place.nameAr,
    summary_en: place.summaryEn,
    summary_ar: place.summaryAr,
    region: place.region,
    difficulty: place.difficulty,
    season_from: place.seasonFrom,
    season_to: place.seasonTo,
    distance_km: place.distanceKm,
    duration_text: place.durationText,
    start_place_en: place.startPlaceEn,
    start_place_ar: place.startPlaceAr,
    end_place_en: place.endPlaceEn,
    end_place_ar: place.endPlaceAr,
    nearby_amenities: place.nearbyAmenities,
    amenities_notes_en: place.amenitiesNotesEn,
    amenities_notes_ar: place.amenitiesNotesAr,
    fragile: place.fragile,
    vehicle_access: place.vehicleAccess,
    access_notes_en: place.accessNotesEn,
    access_notes_ar: place.accessNotesAr,
    trailhead_notes_en: place.trailheadNotesEn,
    trailhead_notes_ar: place.trailheadNotesAr,
    photos: sortPhotosCoverFirst(place.photos),
    updated_at: place.updatedAt,
  }
}

function mapMember(row: MemberRow): Member {
  return {
    id: row.id,
    roleKey: row.role_key,
    displayName: row.display_name,
    jobTitle: row.job_title,
    password: '',
    isActive: row.is_active,
    hasAdmin: row.has_admin,
    workedThisWeek: row.worked_this_week,
  }
}

function mapFinance(row: FinanceRow): FinanceDraft {
  return {
    id: row.id,
    createdBy: row.created_by,
    category: row.category,
    whoFor: row.who_for,
    description: row.description,
    amountOmr: row.amount_omr,
    status: row.status,
    updatedAt: row.updated_at,
  }
}

function financeToRow(draft: FinanceDraft) {
  return {
    id: draft.id,
    created_by: draft.createdBy,
    category: draft.category,
    who_for: draft.whoFor,
    description: draft.description,
    amount_omr: draft.amountOmr,
    status: draft.status,
    updated_at: draft.updatedAt,
  }
}

export async function loginWithPasswordApi(
  password: string,
): Promise<Session | null> {
  const client = requireClient()
  const { data, error } = await client.rpc('admin_login', {
    p_password: password.trim(),
  })
  if (error) throw error
  const result = data as {
    ok?: boolean
    token?: string
    memberId?: string
    roleKey?: RoleKey
    displayName?: string
  } | null
  if (!result?.ok || !result.token || !result.memberId || !result.roleKey) {
    return null
  }
  setAdminToken(result.token)
  return {
    memberId: result.memberId,
    roleKey: result.roleKey,
    displayName: result.displayName ?? result.roleKey,
    token: result.token,
  }
}

export async function logoutApi() {
  const client = supabase
  const token = getAdminToken()
  if (client && token) {
    try {
      await client.rpc('admin_logout')
    } catch {
      /* ignore */
    }
  }
  setAdminToken(null)
}

export async function logActivityApi(action: string, summary: string) {
  const client = requireClient()
  const { error } = await client.rpc('admin_log_activity', {
    p_action: action,
    p_summary: summary,
  })
  if (error) throw error
}

export async function fetchAdminBundle(
  roleKey: RoleKey,
): Promise<AdminBundle> {
  const client = requireClient()

  const membersQuery = client
    .from('team_roles')
    .select(
      'id, role_key, display_name, job_title, is_active, has_admin, worked_this_week',
    )
    .order('display_name')

  const placesQuery = client
    .from('places')
    .select(
      `id, created_by, status, name_en, name_ar, summary_en, summary_ar, region, difficulty,
       season_from, season_to, distance_km, duration_text,
       start_place_en, start_place_ar, end_place_en, end_place_ar,
       nearby_amenities, amenities_notes_en, amenities_notes_ar,
       fragile, vehicle_access,
       access_notes_en, access_notes_ar, trailhead_notes_en, trailhead_notes_ar, photos, updated_at,
       team_roles!places_created_by_fkey(display_name),
       place_safety(*)`,
    )
    .order('updated_at', { ascending: false })

  const [membersRes, placesRes] = await Promise.all([
    membersQuery,
    placesQuery,
  ])

  if (membersRes.error) throw membersRes.error
  if (placesRes.error) throw placesRes.error

  let finance: FinanceDraft[] = []
  let activity: ActivityItem[] = []
  let waitlist: WaitlistRow[] = []

  if (roleKey === 'ceo' || roleKey === 'cfo') {
    const financeRes = await client
      .from('cfo_drafts')
      .select(
        'id, created_by, category, who_for, description, amount_omr, status, updated_at',
      )
      .order('updated_at', { ascending: false })
    if (financeRes.error) throw financeRes.error
    finance = (financeRes.data as FinanceRow[]).map(mapFinance)

    const activityRes = await client
      .from('activity_log')
      .select('id, actor_label, action, summary, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
    if (activityRes.error) throw activityRes.error
    activity = (activityRes.data as ActivityRow[]).map((row) => ({
      id: row.id,
      actor: row.actor_label,
      action: row.action,
      summary: row.summary,
      createdAt: row.created_at,
    }))
  }

  if (roleKey === 'ceo') {
    const waitRes = await client
      .from('waitlist')
      .select('id, email, created_at')
      .order('created_at', { ascending: false })
    if (waitRes.error) throw waitRes.error
    waitlist = (waitRes.data ?? []).map((row) => ({
      id: row.id as string,
      email: row.email as string,
      createdAt: row.created_at as string,
    }))
  }

  return {
    members: (membersRes.data as MemberRow[]).map(mapMember),
    places: (placesRes.data as unknown as PlaceRow[]).map(mapPlace),
    finance,
    activity,
    waitlist,
  }
}

export async function upsertPlaceApi(place: Place) {
  const client = requireClient()
  const { error } = await client.from('places').upsert(placeToRow(place))
  if (error) throw error
}

export async function upsertPlaceSafetyApi(place: Place, actorId: string) {
  const client = requireClient()
  const { error } = await client.from('place_safety').upsert({
    place_id: place.id,
    hazards: place.safety.hazards,
    heat: place.safety.heat,
    flood: place.safety.flood,
    water: place.safety.water,
    signal: place.safety.signal,
    emergency: place.safety.emergency,
    when_not_to_go: place.safety.whenNotToGo,
    kit: place.safety.kit,
    emergency_contacts: place.safety.emergencyContacts,
    nearest_clinic: place.safety.nearestClinic,
    nearest_clinic_place_id: place.safety.nearestClinicPlaceId,
    nearest_clinic_lat: place.safety.nearestClinicLat,
    nearest_clinic_lng: place.safety.nearestClinicLng,
    nearest_clinic_maps_url: place.safety.nearestClinicMapsUrl,
    notes_en: place.safety.notesEn,
    notes_ar: place.safety.notesAr,
    completed: place.safety.completed,
    updated_by: actorId,
  })
  if (error) throw error
}

export async function deletePlaceApi(id: string) {
  const client = requireClient()
  const { error } = await client.from('places').delete().eq('id', id)
  if (error) throw error
}

export async function upsertFinanceApi(draft: FinanceDraft) {
  const client = requireClient()
  const { error } = await client.from('cfo_drafts').upsert(financeToRow(draft))
  if (error) throw error
}

export async function updateMemberMetaApi(
  id: string,
  patch: { jobTitle?: string; isActive?: boolean; displayName?: string },
) {
  const client = requireClient()
  const row: Record<string, unknown> = {}
  if (patch.jobTitle !== undefined) row.job_title = patch.jobTitle
  if (patch.isActive !== undefined) row.is_active = patch.isActive
  if (patch.displayName !== undefined) row.display_name = patch.displayName
  const { error } = await client.from('team_roles').update(row).eq('id', id)
  if (error) throw error
}

export async function setMemberPasswordApi(id: string, password: string) {
  const client = requireClient()
  const { data, error } = await client.rpc('admin_set_password', {
    p_role_id: id,
    p_new_password: password,
  })
  if (error) throw error
  const result = data as { ok?: boolean; error?: string } | null
  if (!result?.ok) {
    throw new Error(result?.error ?? 'password_update_failed')
  }
}

export async function joinWaitlistApi(email: string) {
  const client = requireClient()
  const { data, error } = await client.rpc('join_waitlist', {
    p_email: email.trim().toLowerCase(),
  })
  if (error) throw error
  const result = data as { ok?: boolean; error?: string } | null
  if (!result?.ok) {
    throw new Error(result?.error ?? 'waitlist_failed')
  }
}

/** Public marketing rows — published places only. */
export type PublishedPlaceRow = {
  id: string
  nameEn: string
  nameAr: string
  summaryEn: string
  summaryAr: string
  region: string
  difficulty: string
  seasonFrom: number | null
  seasonTo: number | null
  distanceKm: string
  durationText: string
  photos: PlacePhoto[] | null
}

export async function fetchPublishedPlacesApi(): Promise<PublishedPlaceRow[]> {
  const client = requireClient()
  const { data, error } = await client.rpc('list_published_places')
  if (error) throw error
  if (!Array.isArray(data)) return []
  return data as PublishedPlaceRow[]
}
