import type { Member, RoleKey, Session } from './types'

/** Demo passwords only — replace with Supabase hashes tomorrow. */
export const DEMO_PASSWORDS: Record<string, RoleKey> = {
  'darboha-ceo': 'ceo',
  'darboha-da1': 'da1',
  'darboha-da2': 'da2',
  'darboha-safety': 'safety',
  'darboha-cfo': 'cfo',
}

export const DEMO_PASSWORD_LIST = [
  { role: 'CEO', password: 'darboha-ceo', lands: '/admin/ceo' },
  { role: 'Data Analyst 1', password: 'darboha-da1', lands: '/admin/da' },
  { role: 'Data Analyst 2', password: 'darboha-da2', lands: '/admin/da' },
  { role: 'Health & Safety', password: 'darboha-safety', lands: '/admin/safety' },
  { role: 'CFO / VP', password: 'darboha-cfo', lands: '/admin/cfo' },
] as const

const SESSION_KEY = 'darboha-admin-session'

export function roleHome(role: RoleKey): string {
  if (role === 'da1' || role === 'da2') return '/admin/da'
  return `/admin/${role}`
}

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function writeSession(session: Session | null) {
  try {
    if (!session) localStorage.removeItem(SESSION_KEY)
    else localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    /* ignore */
  }
}

export function loginWithPassword(
  password: string,
  members: Member[],
): Session | null {
  const role = DEMO_PASSWORDS[password.trim()]
  if (!role) {
    // Also accept CEO-edited member passwords from localStorage mock
    const match = members.find(
      (m) => m.hasAdmin && m.isActive && m.password === password.trim(),
    )
    if (!match || match.roleKey === 'social') return null
    return {
      memberId: match.id,
      roleKey: match.roleKey as RoleKey,
      displayName: match.displayName,
    }
  }

  const member = members.find((m) => m.roleKey === role && m.hasAdmin)
  if (!member) return null
  return {
    memberId: member.id,
    roleKey: role,
    displayName: member.displayName,
  }
}
