import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../AdminContext'
import { StatusChip } from '../components/StatusChip'
import { PlaceEditor } from '../components/PlaceEditor'
import { pushActivity, setFinanceStatus } from '../store'
import type { Member } from '../types'

export function CeoOverview() {
  const { store } = useAdmin()
  const counts = {
    draft: store.places.filter((p) => p.status === 'draft').length,
    awaiting: store.places.filter((p) => p.status === 'awaiting_safety').length,
    ready: store.places.filter((p) => p.status === 'ready').length,
    published: store.places.filter((p) => p.status === 'published').length,
  }
  const worked = store.members.filter((m) => m.hasAdmin && m.workedThisWeek)
  const idle = store.members.filter((m) => m.hasAdmin && !m.workedThisWeek)
  const pendingFinance = store.finance.filter(
    (f) => f.status === 'pending_approval',
  ).length

  return (
    <div>
      <div className="admin-crumb">CEO / Overview</div>
      <div className="admin-page-head">
        <div>
          <h1>Overview</h1>
          <p>Draft mock — activity from localStorage, not Supabase yet.</p>
        </div>
      </div>
      <div className="admin-stats">
        <div className="admin-stat">
          <div className="n">{counts.draft}</div>
          <div className="l">Draft</div>
        </div>
        <div className="admin-stat">
          <div className="n">{counts.awaiting}</div>
          <div className="l">Awaiting safety</div>
        </div>
        <div className="admin-stat">
          <div className="n">{counts.ready}</div>
          <div className="l">Ready</div>
        </div>
        <div className="admin-stat">
          <div className="n">{counts.published}</div>
          <div className="l">Published</div>
        </div>
        <div className="admin-stat">
          <div className="n">{pendingFinance}</div>
          <div className="l">Finance approvals</div>
        </div>
      </div>
      <div className="admin-split">
        <div className="admin-panel">
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>
            Who worked this week
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
            {worked.map((m) => (
              <li key={m.id}>
                {m.displayName} — {m.jobTitle}
              </li>
            ))}
          </ul>
        </div>
        <div className="admin-panel">
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>
            Who didn’t
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
            {idle.map((m) => (
              <li key={m.id}>
                {m.displayName} — {m.jobTitle}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="admin-panel" style={{ marginTop: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>
          Recent activity
        </h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Who</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {store.activity.slice(0, 6).map((a) => (
              <tr key={a.id}>
                <td>{new Date(a.createdAt).toLocaleString()}</td>
                <td>{a.actor}</td>
                <td>{a.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function CeoPlaces() {
  const { store } = useAdmin()
  return (
    <div>
      <div className="admin-crumb">CEO / Places</div>
      <div className="admin-page-head">
        <div>
          <h1>All places</h1>
          <p>Open any · delete any · Ready / Publish from the editor.</p>
        </div>
      </div>
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {store.places.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link to={`/admin/ceo/places/${p.id}`}>{p.nameEn}</Link>
                </td>
                <td>{p.ownerLabel}</td>
                <td>
                  <StatusChip status={p.status} />
                </td>
                <td>{new Date(p.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function CeoPlaceDetail({ id }: { id: string }) {
  return <PlaceEditor placeId={id} backTo="/admin/ceo/places" />
}

export function CeoFinance() {
  const { session, store, updateStore } = useAdmin()
  if (!session) return null

  function decide(id: string, status: 'approved' | 'rejected') {
    if (!session) return
    const draft = store.finance.find((f) => f.id === id)
    updateStore(
      pushActivity(
        setFinanceStatus(store, id, status),
        session.displayName,
        `finance.${status}`,
        `${status === 'approved' ? 'Approved' : 'Rejected'} ${draft?.category || id}`,
      ),
    )
  }

  return (
    <div>
      <div className="admin-crumb">CEO / Finance</div>
      <div className="admin-page-head">
        <div>
          <h1>CFO approvals</h1>
          <p>Approve or reject budget drafts.</p>
        </div>
      </div>
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Who for</th>
              <th>Description</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {store.finance.map((f) => (
              <tr key={f.id}>
                <td>{f.category}</td>
                <td>{f.whoFor}</td>
                <td>{f.description}</td>
                <td>
                  <StatusChip status={f.status} />
                </td>
                <td>
                  {f.status === 'pending_approval' && (
                    <div className="admin-actions" style={{ marginTop: 0 }}>
                      <button
                        type="button"
                        className="admin-btn"
                        onClick={() => decide(f.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="admin-btn danger"
                        onClick={() => decide(f.id, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function CeoTeam() {
  const { session, store, updateStore } = useAdmin()
  const [msg, setMsg] = useState<string | null>(null)
  if (!session) return null

  function updateMember(id: string, patch: Partial<Member>) {
    updateStore({
      ...store,
      members: store.members.map((m) =>
        m.id === id ? { ...m, ...patch } : m,
      ),
    })
    setMsg('Team access saved locally (demo passwords in UI).')
  }

  return (
    <div>
      <div className="admin-crumb">CEO / Team & access</div>
      <div className="admin-page-head">
        <div>
          <h1>Team & access</h1>
          <p>
            Edit passwords and jobs. Social media teammates have no admin
            module.
          </p>
        </div>
      </div>
      {msg && <div className="admin-banner info">{msg}</div>}
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Job / role</th>
              <th>Password</th>
              <th>Admin?</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {store.members.map((m) => (
              <tr key={m.id}>
                <td>{m.displayName}</td>
                <td>
                  <input
                    value={m.jobTitle}
                    disabled={!m.hasAdmin}
                    onChange={(e) =>
                      updateMember(m.id, { jobTitle: e.target.value })
                    }
                    style={{
                      width: '100%',
                      border: '1px solid #d5e0d9',
                      borderRadius: 8,
                      padding: '0.35rem 0.5rem',
                    }}
                  />
                </td>
                <td>
                  {m.hasAdmin ? (
                    <input
                      type="text"
                      value={m.password}
                      onChange={(e) =>
                        updateMember(m.id, { password: e.target.value })
                      }
                      style={{
                        width: '100%',
                        border: '1px solid #d5e0d9',
                        borderRadius: 8,
                        padding: '0.35rem 0.5rem',
                        fontFamily: 'ui-monospace, monospace',
                        fontSize: '0.8rem',
                      }}
                    />
                  ) : (
                    <span className="admin-muted">External / no dashboard</span>
                  )}
                </td>
                <td>{m.hasAdmin ? 'Yes' : 'No'}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={m.isActive}
                    disabled={!m.hasAdmin}
                    onChange={(e) =>
                      updateMember(m.id, { isActive: e.target.checked })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function CeoActivity() {
  const { store } = useAdmin()
  return (
    <div>
      <div className="admin-crumb">CEO / Activity</div>
      <div className="admin-page-head">
        <div>
          <h1>Activity feed</h1>
          <p>Mock audit log — will be Supabase-backed tomorrow.</p>
        </div>
      </div>
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {store.activity.map((a) => (
              <tr key={a.id}>
                <td>{new Date(a.createdAt).toLocaleString()}</td>
                <td>{a.actor}</td>
                <td>
                  <code style={{ fontSize: '0.78rem' }}>{a.action}</code>
                </td>
                <td>{a.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function CeoAnalytics() {
  return (
    <div>
      <div className="admin-crumb">CEO / Analytics</div>
      <div className="admin-page-head">
        <div>
          <h1>Site analytics</h1>
          <p>Placeholder — Vercel Analytics later; not PostHog for admin.</p>
        </div>
      </div>
      <div className="admin-stats">
        <div className="admin-stat">
          <div className="n">—</div>
          <div className="l">Pageviews (7d)</div>
        </div>
        <div className="admin-stat">
          <div className="n">—</div>
          <div className="l">Top page</div>
        </div>
        <div className="admin-stat">
          <div className="n">—</div>
          <div className="l">Waitlist signups</div>
        </div>
      </div>
      <div className="admin-panel admin-coming">
        <p className="admin-muted">
          Charts and referrers will appear when analytics are wired. This screen
          is CEO-only.
        </p>
      </div>
    </div>
  )
}

export function CeoWaitlist() {
  const emails = [
    { email: 'hiker@example.com', createdAt: '2026-11-15T10:00:00Z' },
    { email: 'traveler.om@example.com', createdAt: '2026-11-14T18:20:00Z' },
  ]
  return (
    <div>
      <div className="admin-crumb">CEO / Waitlist</div>
      <div className="admin-page-head">
        <div>
          <h1>Waitlist</h1>
          <p>Mock emails — Supabase table tomorrow.</p>
        </div>
      </div>
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((row) => (
              <tr key={row.email}>
                <td>{row.email}</td>
                <td>{new Date(row.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
