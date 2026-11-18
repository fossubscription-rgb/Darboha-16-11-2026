import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { loginWithPasswordApi } from '../api'
import { roleHome } from '../auth'
import { useAdmin } from '../AdminContext'
import { isSupabaseConfigured } from '../../lib/supabase'

export function Gate() {
  const { session, setSession } = useAdmin()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (session) {
    return <Navigate to={roleHome(session.roleKey)} replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isSupabaseConfigured()) {
      setError('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const next = await loginWithPasswordApi(password)
      if (!next) {
        setError('Incorrect password')
        return
      }
      setSession(next)
      navigate(roleHome(next.roleKey))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-gate">
      <form className="admin-gate-card" onSubmit={onSubmit}>
        <h1 className="wordmark">Darboha Admin</h1>
        <p className="sub">
          Password-only gate. Enter your role password — no username. Session is
          bound to that role (URL swap cannot skip auth).
        </p>
        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError(null)
          }}
          placeholder="••••••••"
          disabled={busy}
        />
        {error && <p className="admin-error">{error}</p>}
        <button
          type="submit"
          className="admin-btn"
          style={{ width: '100%' }}
          disabled={busy}
        >
          {busy ? 'Checking…' : 'Enter'}
        </button>
        <p className="admin-hint">
          Ask the CEO for your role password. Passwords are not shown here.
        </p>
      </form>
    </div>
  )
}
