export const DIFFICULTY_OPTIONS = [
  'Easy',
  'Easy–Moderate',
  'Moderate',
  'Hard',
  'Expert',
] as const

export type Difficulty = (typeof DIFFICULTY_OPTIONS)[number]

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
