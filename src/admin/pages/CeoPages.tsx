import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../AdminContext'
import { StatusChip } from '../components/StatusChip'
import { PlaceEditor } from '../components/PlaceEditor'
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
          <p>Live counts and activity from Supabase.</p>
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
          {worked.length === 0 ? (
            <div className="admin-empty">No admin logins this week yet.</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
              {worked.map((m) => (
                <li key={m.id}>
                  {m.displayName} — {m.jobTitle}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="admin-panel">
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>
            Who didn’t
          </h3>
          {idle.length === 0 ? (
            <div className="admin-empty">Everyone with admin access logged in.</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
              {idle.map((m) => (
                <li key={m.id}>
                  {m.displayName} — {m.jobTitle}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="admin-panel" style={{ marginTop: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>
          Recent activity
        </h3>
        {store.activity.length === 0 ? (
          <div className="admin-empty">
            No activity yet — it appears when the team creates places or finance drafts.
          </div>
        ) : (
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
        )}
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
        {store.places.length === 0 ? (
          <div className="admin-empty">
            No places yet — the map is empty until analysts add the first draft.
          </div>
        ) : (
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
                    <Link to={`/admin/ceo/places/${p.id}`}>
                      {p.nameEn || 'Untitled'}
                    </Link>
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
        )}
      </div>
    </div>
  )
}

export function CeoPlaceDetail({ id }: { id: string }) {
  return <PlaceEditor placeId={id} backTo="/admin/ceo/places" />
}

export function CeoFinance() {
  const { session, store, setFinanceStatusRemote } = useAdmin()
  if (!session) return null

  const pending = store.finance.filter((f) => f.status === 'pending_approval')
  const others = store.finance.filter((f) => f.status !== 'pending_approval')

  async function decide(id: string, status: 'approved' | 'rejected') {
    if (!session) return
    const draft = store.finance.find((f) => f.id === id)
    try {
      await setFinanceStatusRemote(id, status, {
        action: `finance.${status}`,
        summary: `${status === 'approved' ? 'Approved' : 'Rejected'} ${draft?.category || id} (${draft?.amountOmr || '?'} OMR)`,
      })
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Update failed')
    }
  }

  return (
    <div>
      <div className="admin-crumb">CEO / Finance</div>
      <div className="admin-page-head">
        <div>
          <h1>CFO approvals</h1>
          <p>
            Review category, who-for, description, and <strong>pricing (OMR)</strong>{' '}
            before approving.
          </p>
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="admin-panel admin-empty">No drafts waiting for approval.</div>
      ) : (
        pending.map((f) => (
          <div key={f.id} className="admin-panel" style={{ marginBottom: '0.85rem' }}>
            <div className="admin-page-head" style={{ marginBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', margin: 0 }}>{f.category}</h2>
                <p>
                  <StatusChip status={f.status} /> · Who for: {f.whoFor}
                </p>
              </div>
              <div className="admin-stat" style={{ minWidth: '140px' }}>
                <div className="n">{f.amountOmr || '—'} </div>
                <div className="l">Pricing (OMR)</div>
              </div>
            </div>
            <p style={{ margin: '0 0 0.85rem', lineHeight: 1.45 }}>{f.description}</p>
            <div className="admin-actions" style={{ marginTop: 0 }}>
              <button
                type="button"
                className="admin-btn"
                onClick={() => void decide(f.id, 'approved')}
              >
                Approve {f.amountOmr ? `(${f.amountOmr} OMR)` : ''}
              </button>
              <button
                type="button"
                className="admin-btn danger"
                onClick={() => void decide(f.id, 'rejected')}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}

      {others.length > 0 && (
        <div className="admin-panel" style={{ marginTop: '1rem' }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Other drafts</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Who for</th>
                <th>Pricing (OMR)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {others.map((f) => (
                <tr key={f.id}>
                  <td>{f.category}</td>
                  <td>{f.whoFor}</td>
                  <td>
                    <strong>{f.amountOmr || '—'}</strong>
                  </td>
                  <td>
                    <StatusChip status={f.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function CeoTeam() {
  const { session, store, saveMemberMeta, saveMemberPassword } = useAdmin()
  const [jobDrafts, setJobDrafts] = useState<Record<string, string>>({})
  const [draftPasswords, setDraftPasswords] = useState<Record<string, string>>(
    {},
  )
  const [msg, setMsg] = useState<string | null>(null)
  if (!session) return null

  function jobValue(m: Member) {
    return jobDrafts[m.id] ?? m.jobTitle
  }

  async function saveJob(id: string) {
    const jobTitle = (jobDrafts[id] ?? '').trim()
    if (!jobTitle) {
      setMsg('Job title cannot be empty.')
      return
    }
    try {
      await saveMemberMeta(id, { jobTitle })
      setJobDrafts((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      setMsg('Job title saved.')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed')
    }
  }

  async function savePassword(id: string) {
    const password = (draftPasswords[id] || '').trim()
    if (password.length < 6) {
      setMsg('New password must be at least 6 characters.')
      return
    }
    try {
      await saveMemberPassword(id, password)
      setDraftPasswords((prev) => ({ ...prev, [id]: '' }))
      setMsg('Password updated (hash stored in Supabase).')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Password update failed')
    }
  }

  return (
    <div>
      <div className="admin-crumb">CEO / Team & access</div>
      <div className="admin-page-head">
        <div>
          <h1>Team & access</h1>
          <p>
            Edit jobs and set new passwords. Hashes live in Supabase — plaintext
            is never loaded. Social media teammates have no admin module.
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
              <th>New password</th>
              <th>Admin?</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {store.members.map((m) => (
              <tr key={m.id}>
                <td>{m.displayName}</td>
                <td>
                  {m.hasAdmin ? (
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <input
                        value={jobValue(m)}
                        onChange={(e) =>
                          setJobDrafts((prev) => ({
                            ...prev,
                            [m.id]: e.target.value,
                          }))
                        }
                        style={{
                          width: '100%',
                          border: '1px solid #d5e0d9',
                          borderRadius: 8,
                          padding: '0.35rem 0.5rem',
                        }}
                      />
                      <button
                        type="button"
                        className="admin-btn secondary"
                        style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                        onClick={() => void saveJob(m.id)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <span className="admin-muted">{m.jobTitle}</span>
                  )}
                </td>
                <td>
                  {m.hasAdmin ? (
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <input
                        type="password"
                        value={draftPasswords[m.id] ?? ''}
                        placeholder="Set new…"
                        onChange={(e) =>
                          setDraftPasswords((prev) => ({
                            ...prev,
                            [m.id]: e.target.value,
                          }))
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
                      <button
                        type="button"
                        className="admin-btn secondary"
                        style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                        onClick={() => void savePassword(m.id)}
                      >
                        Set
                      </button>
                    </div>
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
                      void saveMemberMeta(m.id, { isActive: e.target.checked })
                        .then(() => setMsg('Active flag saved.'))
                        .catch((err) =>
                          setMsg(
                            err instanceof Error ? err.message : 'Save failed',
                          ),
                        )
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

function formatDuration(ms: number | null): string {
  if (ms == null || Number.isNaN(ms) || ms < 0) return '—'
  const hours = Math.round(ms / (1000 * 60 * 60))
  if (hours < 48) return `${hours}h`
  return `${Math.round(hours / 24)}d`
}

function publishPipeline(activity: { actor: string; action: string; summary: string; createdAt: string }[]) {
  const byPlace = new Map<
    string,
    {
      place: string
      draftedBy?: string
      draftedAt?: string
      safetyBy?: string
      safetyAt?: string
      publishedBy?: string
      publishedAt?: string
    }
  >()

  function keyFromSummary(summary: string): string {
    const m =
      summary.match(
        /(?:Submitted|Marked|Published|Saved|Created|Deleted|Updated safety for)\s+(.+?)(?:\s+for safety|\s+Ready|$)/i,
      ) || summary.match(/(.+)/)
    return (m?.[1] || summary).trim()
  }

  for (const a of activity) {
    const place = keyFromSummary(a.summary)
    const row = byPlace.get(place) ?? { place }
    if (
      a.action === 'place.created' ||
      a.action === 'place.submitted' ||
      (a.action === 'place.saved' && /submitted/i.test(a.summary))
    ) {
      row.draftedBy = row.draftedBy || a.actor
      row.draftedAt = row.draftedAt || a.createdAt
    }
    if (a.action === 'place.submitted') {
      row.draftedBy = a.actor
      row.draftedAt = a.createdAt
    }
    if (a.action === 'safety.ready') {
      row.safetyBy = a.actor
      row.safetyAt = a.createdAt
    }
    if (a.action === 'place.published' || /Published /i.test(a.summary)) {
      row.publishedBy = a.actor
      row.publishedAt = a.createdAt
      if (a.action === 'place.saved') {
        /* still count from summary */
      }
    }
    byPlace.set(place, row)
  }

  return [...byPlace.values()]
    .filter((r) => r.draftedBy || r.safetyBy || r.publishedBy)
    .map((r) => ({
      ...r,
      timeToPublishMs:
        r.draftedAt && r.publishedAt
          ? new Date(r.publishedAt).getTime() -
            new Date(r.draftedAt).getTime()
          : null,
    }))
}

export function CeoActivity() {
  const { store } = useAdmin()
  const pipeline = publishPipeline(store.activity)

  return (
    <div>
      <div className="admin-crumb">CEO / Activity</div>
      <div className="admin-page-head">
        <div>
          <h1>Activity feed</h1>
          <p>
            Who drafted, who cleared safety, time-to-publish — from
            activity_log (not PostHog).
          </p>
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>
          Publish pipeline
        </h3>
        {pipeline.length === 0 ? (
          <div className="admin-empty">No draft → publish trails yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Place</th>
                <th>Drafted by</th>
                <th>Safety cleared by</th>
                <th>Published by</th>
                <th>Time to publish</th>
              </tr>
            </thead>
            <tbody>
              {pipeline.map((row) => (
                <tr key={row.place}>
                  <td>{row.place}</td>
                  <td>{row.draftedBy || '—'}</td>
                  <td>{row.safetyBy || '—'}</td>
                  <td>{row.publishedBy || '—'}</td>
                  <td>{formatDuration(row.timeToPublishMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-panel">
        {store.activity.length === 0 ? (
          <div className="admin-empty">Activity feed is empty.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
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
        )}
      </div>
    </div>
  )
}

export function CeoAnalytics() {
  const { waitlist } = useAdmin()
  return (
    <div>
      <div className="admin-crumb">CEO / Analytics</div>
      <div className="admin-page-head">
        <div>
          <h1>Site analytics</h1>
          <p>Live waitlist count now. Traffic charts when Vercel Analytics is wired.</p>
        </div>
      </div>
      <div className="admin-stats">
        <div className="admin-stat">
          <div className="n">{waitlist.length}</div>
          <div className="l">Waitlist signups</div>
        </div>
      </div>
      <div className="admin-panel admin-coming">
        <p className="admin-muted">
          No traffic charts yet — this screen stays empty until analytics are connected.
        </p>
      </div>
    </div>
  )
}

export function CeoWaitlist() {
  const { waitlist } = useAdmin()
  return (
    <div>
      <div className="admin-crumb">CEO / Waitlist</div>
      <div className="admin-page-head">
        <div>
          <h1>Waitlist</h1>
          <p>Emails from the marketing site (Supabase waitlist table).</p>
        </div>
      </div>
      <div className="admin-panel">
        {waitlist.length === 0 ? (
          <div className="admin-empty">No waitlist emails yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.map((row) => (
                <tr key={row.id}>
                  <td>{row.email}</td>
                  <td>{new Date(row.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
