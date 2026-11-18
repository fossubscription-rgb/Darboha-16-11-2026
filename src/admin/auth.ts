import { getAdminToken, setAdminToken } from '../lib/supabase'
import type { RoleKey, Session } from './types'

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
