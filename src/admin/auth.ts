import { getAdminToken, setAdminToken } from '../lib/supabase'
import type { RoleKey, Session } from './types'

/** Demo passwords shown in the gate UI only — real checks hit Supabase hashes. */
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
    const parsed = JSON.parse(raw) as Session
    if (!parsed?.memberId || !parsed?.roleKey || !parsed?.token) return null
    if (getAdminToken() !== parsed.token) setAdminToken(parsed.token)
    return parsed
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
