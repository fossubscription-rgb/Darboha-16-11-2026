import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { DEMO_PASSWORD_LIST, loginWithPassword, roleHome } from '../auth'
import { useAdmin } from '../AdminContext'

export function Gate() {
  const { session, setSession, store } = useAdmin()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (session) {
    return <Navigate to={roleHome(session.roleKey)} replace />
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next = loginWithPassword(password, store.members)
    if (!next) {
      setError('Incorrect password')
      return
    }
    setSession(next)
    navigate(roleHome(next.roleKey))
  }

  return (
    <div className="admin-gate">
      <form className="admin-gate-card" onSubmit={onSubmit}>
        <h1 className="wordmark">Darboha Admin</h1>
        <p className="sub">
          Password-only gate (draft). Enter your role password — no username.
          Mock localStorage only; Supabase lands tomorrow.
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
        />
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" className="admin-btn" style={{ width: '100%' }}>
          Enter
        </button>
        <div className="admin-hint">
          <strong>Demo passwords (draft only):</strong>
          <ul style={{ paddingLeft: '1.1rem', margin: '0.4rem 0 0' }}>
            {DEMO_PASSWORD_LIST.map((row) => (
              <li key={row.password}>
                {row.role}: <code>{row.password}</code>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  )
}
