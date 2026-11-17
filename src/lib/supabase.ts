import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const SESSION_TOKEN_KEY = 'darboha-admin-session-token'

let adminToken: string | null = null

try {
  adminToken = localStorage.getItem(SESSION_TOKEN_KEY)
} catch {
  adminToken = null
}

export function getAdminToken(): string | null {
  return adminToken
}

export function setAdminToken(token: string | null) {
  adminToken = token
  try {
    if (!token) localStorage.removeItem(SESSION_TOKEN_KEY)
    else localStorage.setItem(SESSION_TOKEN_KEY, token)
  } catch {
    /* ignore */
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey)
}

function createBrowserClient(): SupabaseClient | null {
  if (!url || !anonKey) return null
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init = {}) => {
        const headers = new Headers(init.headers)
        const token = getAdminToken()
        if (token) headers.set('x-admin-session', token)
        return fetch(input, { ...init, headers })
      },
    },
  })
}

export const supabase = createBrowserClient()
