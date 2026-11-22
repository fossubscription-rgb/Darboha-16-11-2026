export const DIFFICULTY_OPTIONS = [
  'Easy',
  'Easy–Moderate',
  'Moderate',
  'Hard',
  'Expert',
] as const

export type Difficulty = (typeof DIFFICULTY_OPTIONS)[number]

/** Student-friendly Safety checklist dropdowns (stored as codes). */
export const SAFETY_DROPDOWNS = {
  hazards: [
    { value: 'none', label: 'None / low risk' },
    { value: 'edges', label: 'Cliff / unfenced edges' },
    { value: 'slippery', label: 'Slippery rock / falaj' },
    { value: 'wildlife', label: 'Wildlife / insects' },
    { value: 'other', label: 'Other (see notes)' },
  ],
  heat: [
    { value: 'low', label: 'Low — shade / cool season' },
    { value: 'moderate', label: 'Moderate — start early' },
    { value: 'high', label: 'High — midday dangerous' },
    { value: 'extreme', label: 'Extreme — avoid summer midday' },
  ],
  flood: [
    { value: 'none', label: 'No flood concern' },
    { value: 'seasonal', label: 'Seasonal wadi flow' },
    { value: 'flash_risk', label: 'Flash-flood risk' },
    { value: 'avoid_rain', label: 'Avoid after / during rain' },
  ],
  water: [
    { value: 'bring_all', label: 'Bring all water' },
    { value: 'limited', label: 'Limited refill on trail' },
    { value: 'falaj', label: 'Falaj / pools (treat carefully)' },
    { value: 'shops_nearby', label: 'Shops / village nearby' },
  ],
  signal: [
    { value: 'good', label: 'Usually good' },
    { value: 'spotty', label: 'Spotty' },
    { value: 'none', label: 'Little / no signal' },
  ],
  whenNotToGo: [
    { value: 'rain_flood', label: 'Rain / flood risk' },
    { value: 'midday_heat', label: 'Midday heat' },
    { value: 'night', label: 'After dark' },
    { value: 'crowds', label: 'Peak crowds' },
    { value: 'high_wind', label: 'High wind / fog' },
    { value: 'other', label: 'Other (see notes)' },
  ],
  kit: [
    { value: 'basic', label: 'Water + phone + shoes' },
    { value: 'water_sun', label: 'Extra water + sun protection' },
    { value: 'grippy_shoes', label: 'Grippy shoes + small first-aid' },
    { value: 'full_day', label: 'Full day pack (food, layers, headlamp)' },
  ],
} as const

export const MONTHS = [
  { value: 1, en: 'Jan', ar: 'يناير' },
  { value: 2, en: 'Feb', ar: 'فبراير' },
  { value: 3, en: 'Mar', ar: 'مارس' },
  { value: 4, en: 'Apr', ar: 'أبريل' },
  { value: 5, en: 'May', ar: 'مايو' },
  { value: 6, en: 'Jun', ar: 'يونيو' },
  { value: 7, en: 'Jul', ar: 'يوليو' },
  { value: 8, en: 'Aug', ar: 'أغسطس' },
  { value: 9, en: 'Sep', ar: 'سبتمبر' },
  { value: 10, en: 'Oct', ar: 'أكتوبر' },
  { value: 11, en: 'Nov', ar: 'نوفمبر' },
  { value: 12, en: 'Dec', ar: 'ديسمبر' },
] as const

export type MonthValue = (typeof MONTHS)[number]['value']

export function formatSeasonRange(
  from: MonthValue | null | undefined,
  to: MonthValue | null | undefined,
): string {
  if (!from || !to) return '—'
  const a = MONTHS.find((m) => m.value === from)
  const b = MONTHS.find((m) => m.value === to)
  if (!a || !b) return '—'
  return `${a.en} → ${b.en}`
}

/** Path prefix after /admin/ that belongs to a role module. */
export function routeModuleFromPath(pathname: string): string | null {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  // ["admin", "ceo", ...] or ["admin"]
  if (parts[0] !== 'admin' || !parts[1]) return null
  return parts[1]
}

export function sessionOwnsModule(
  roleKey: string,
  module: string | null,
): boolean {
  if (!module) return true
  if (module === 'da') return roleKey === 'da1' || roleKey === 'da2'
  if (module === 'ceo') return roleKey === 'ceo'
  if (module === 'safety') return roleKey === 'safety'
  if (module === 'cfo') return roleKey === 'cfo'
  return false
}

/** Short role label for ownership chips (name · role). */
export function roleLabelForKey(roleKey: string | undefined | null): string {
  switch (roleKey) {
    case 'ceo':
      return 'CEO'
    case 'da1':
    case 'da2':
      return 'Data Analyst'
    case 'safety':
      return 'Health & Safety'
    case 'cfo':
      return 'CFO / VP'
    case 'social':
      return 'Social'
    default:
      return 'Teammate'
  }
}

/** "Analyst 1 · Data Analyst" style ownership string. */
export function formatPlaceOwner(
  displayName: string | undefined | null,
  roleKey?: string | null,
): string {
  const name = (displayName ?? '').trim() || 'Teammate'
  const role = roleLabelForKey(roleKey)
  return `${name} · ${role}`
}

export function isDataAnalystRole(roleKey: string | undefined | null): boolean {
  return roleKey === 'da1' || roleKey === 'da2'
}
