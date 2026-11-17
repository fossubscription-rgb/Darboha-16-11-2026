import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { roleHome } from '../auth'
import { useAdmin } from '../AdminContext'

type NavItem = { to: string; label: string; end?: boolean }

function navForRole(roleKey: string): NavItem[] {
  if (roleKey === 'da1' || roleKey === 'da2') {
    return [
      { to: '/admin/da', label: 'My places', end: true },
      { to: '/admin/da/team', label: 'Team places' },
    ]
  }
  if (roleKey === 'safety') {
    return [
      { to: '/admin/safety', label: 'Safety queue', end: true },
      { to: '/admin/safety/places', label: 'All places' },
    ]
  }
  if (roleKey === 'cfo') {
    return [
      { to: '/admin/cfo', label: 'Budget drafts', end: true },
      { to: '/admin/cfo/places', label: 'Places (read-only)' },
      { to: '/admin/cfo/activity', label: 'Team activity' },
      { to: '/admin/cfo/published', label: 'Published glance' },
      { to: '/admin/cfo/sponsors', label: 'Sponsors' },
    ]
  }
  return [
    { to: '/admin/ceo', label: 'Overview', end: true },
    { to: '/admin/ceo/places', label: 'Places' },
    { to: '/admin/ceo/finance', label: 'CFO approvals' },
    { to: '/admin/ceo/team', label: 'Team & access' },
    { to: '/admin/ceo/activity', label: 'Activity' },
    { to: '/admin/ceo/analytics', label: 'Analytics' },
    { to: '/admin/ceo/waitlist', label: 'Waitlist' },
  ]
}

const ROLE_LABEL: Record<string, string> = {
  ceo: 'CEO',
  da1: 'Data Analyst',
  da2: 'Data Analyst',
  safety: 'Health & Safety',
  cfo: 'CFO / VP',
}

export function Shell() {
  const { session, logout, loading, error, refresh } = useAdmin()
  const navigate = useNavigate()
  if (!session) return null

  const items = navForRole(session.roleKey)

  async function onLogout() {
    await logout()
    navigate('/admin')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <div className="wordmark">Darboha Admin</div>
          <p className="role-pill">
            {ROLE_LABEL[session.roleKey]} · {session.displayName}
          </p>
        </div>
        <nav className="admin-nav" aria-label="Admin">
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
          <button type="button" className="admin-btn ghost" onClick={onLogout}>
            Log out
          </button>
          <button
            type="button"
            className="admin-btn ghost"
            onClick={() => void refresh()}
            title="Reload from Supabase"
          >
            Refresh data
          </button>
          <a
            className="admin-btn ghost"
            href={roleHome(session.roleKey)}
            style={{ textAlign: 'center' }}
          >
            Role home
          </a>
        </div>
      </aside>
      <main className="admin-main">
        {loading && (
          <div className="admin-banner info" style={{ marginBottom: '1rem' }}>
            Loading from Supabase…
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
