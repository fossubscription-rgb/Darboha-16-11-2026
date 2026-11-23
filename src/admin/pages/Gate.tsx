import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { loginWithPasswordApi } from '../api'
import { roleHome } from '../auth'
import { useAdmin } from '../AdminContext'
import { LangToggleButton, useAdminLocale } from '../AdminLocale'
import { isSupabaseConfigured } from '../../lib/supabase'

export function Gate() {
  const { session, setSession } = useAdmin()
  const { t } = useAdminLocale()
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
      setError(t.gate.missingEnv)
      return
    }
    setBusy(true)
    setError(null)
    try {
      const next = await loginWithPasswordApi(password)
      if (!next) {
        setError(t.gate.incorrect)
        return
      }
      setSession(next)
      navigate(roleHome(next.roleKey))
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.loginFailed)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-gate">
      <form className="admin-gate-card" onSubmit={onSubmit}>
        <div className="admin-gate-top">
          <h1 className="wordmark">{t.brand}</h1>
          <LangToggleButton />
        </div>
        <p className="sub">{t.gate.sub}</p>
        <label htmlFor="admin-password">{t.gate.password}</label>
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
          {busy ? t.gate.checking : t.gate.enter}
        </button>
        <p className="admin-hint">{t.gate.hint}</p>
      </form>
    </div>
  )
}
