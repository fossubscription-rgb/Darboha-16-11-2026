import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { roleHome } from '../auth'
import { useAdmin } from '../AdminContext'
import { LangToggleButton, useAdminLocale } from '../AdminLocale'
import type { AdminCopy } from '../i18n'

type NavItem = { to: string; label: string; end?: boolean }

function navForRole(roleKey: string, t: AdminCopy): NavItem[] {
  if (roleKey === 'da1' || roleKey === 'da2') {
    return [
      { to: '/admin/da', label: t.nav.myPlaces, end: true },
      { to: '/admin/da/team', label: t.nav.teamPlaces },
    ]
  }
  if (roleKey === 'safety') {
    return [
      { to: '/admin/safety', label: t.nav.safetyQueue, end: true },
      { to: '/admin/safety/places', label: t.nav.allPlaces },
    ]
  }
  if (roleKey === 'cfo') {
    return [
      { to: '/admin/cfo', label: t.nav.budgetDrafts, end: true },
      { to: '/admin/cfo/places', label: t.nav.placesReadonly },
      { to: '/admin/cfo/activity', label: t.nav.teamActivity },
      { to: '/admin/cfo/published', label: t.nav.publishedGlance },
      { to: '/admin/cfo/sponsors', label: t.nav.sponsors },
    ]
  }
  return [
    { to: '/admin/ceo', label: t.nav.overview, end: true },
    { to: '/admin/ceo/places', label: t.nav.places },
    { to: '/admin/ceo/finance', label: t.nav.cfoApprovals },
    { to: '/admin/ceo/team', label: t.nav.teamAccess },
    { to: '/admin/ceo/activity', label: t.nav.activity },
    { to: '/admin/ceo/analytics', label: t.nav.analytics },
    { to: '/admin/ceo/waitlist', label: t.nav.waitlist },
  ]
}

function roleLabel(roleKey: string, t: AdminCopy): string {
  if (roleKey === 'ceo') return t.roles.ceo
  if (roleKey === 'da1' || roleKey === 'da2') return t.roles.da
  if (roleKey === 'safety') return t.roles.safety
  if (roleKey === 'cfo') return t.roles.cfo
  return t.roles.teammate
}

export function Shell() {
  const { session, logout, loading, error, refresh } = useAdmin()
  const { t } = useAdminLocale()
  const navigate = useNavigate()
  if (!session) return null

  const items = navForRole(session.roleKey, t)

  async function onLogout() {
    await logout()
    navigate('/admin')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <div className="wordmark">{t.brand}</div>
          <p className="role-pill">
            {roleLabel(session.roleKey, t)} · {session.displayName}
          </p>
        </div>
        <nav className="admin-nav" aria-label={t.common.navAria}>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <LangToggleButton className="admin-btn ghost admin-lang-toggle" />
          <button type="button" className="admin-btn ghost" onClick={onLogout}>
            {t.common.logOut}
          </button>
          <button
            type="button"
            className="admin-btn ghost"
            onClick={() => void refresh()}
            title={t.common.refreshTitle}
          >
            {t.common.refreshData}
          </button>
          <a
            className="admin-btn ghost"
            href={roleHome(session.roleKey)}
            style={{ textAlign: 'center' }}
          >
            {t.common.roleHome}
          </a>
        </div>
      </aside>
      <main className="admin-main">
        {loading && (
          <div className="admin-banner info" style={{ marginBottom: '1rem' }}>
            {t.common.loadingSupabase}
          </div>
        )}
        {error && (
          <div className="admin-banner" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <Outlet />
      </main>
    </div>
  )
}
