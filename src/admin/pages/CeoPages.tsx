import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../AdminContext'
import { useAdminLocale } from '../AdminLocale'
import { StatusChip } from '../components/StatusChip'
import { PlaceEditor } from '../components/PlaceEditor'
import type { Member } from '../types'

export function CeoOverview() {
  const { store } = useAdmin()
  const { t } = useAdminLocale()
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
      <div className="admin-crumb">{t.ceo.crumbOverview}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.ceo.titleOverview}</h1>
          <p>{t.ceo.ledeOverview}</p>
        </div>
      </div>
      <div className="admin-stats">
        <div className="admin-stat">
          <div className="n">{counts.draft}</div>
          <div className="l">{t.ceo.draft}</div>
        </div>
        <div className="admin-stat">
          <div className="n">{counts.awaiting}</div>
          <div className="l">{t.ceo.awaitingSafety}</div>
        </div>
        <div className="admin-stat">
          <div className="n">{counts.ready}</div>
          <div className="l">{t.ceo.ready}</div>
        </div>
        <div className="admin-stat">
          <div className="n">{counts.published}</div>
          <div className="l">{t.ceo.published}</div>
        </div>
        <div className="admin-stat">
          <div className="n">{pendingFinance}</div>
          <div className="l">{t.ceo.financeApprovals}</div>
        </div>
      </div>
      <div className="admin-split">
        <div className="admin-panel">
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>
            {t.ceo.whoWorked}
          </h3>
          {worked.length === 0 ? (
            <div className="admin-empty">{t.ceo.noLogins}</div>
          ) : (
            <ul style={{ margin: 0, paddingInlineStart: '1.1rem' }}>
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
            {t.ceo.whoDidnt}
          </h3>
          {idle.length === 0 ? (
            <div className="admin-empty">{t.ceo.everyoneLogged}</div>
          ) : (
            <ul style={{ margin: 0, paddingInlineStart: '1.1rem' }}>
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
          {t.ceo.recentActivity}
        </h3>
        {store.activity.length === 0 ? (
          <div className="admin-empty">{t.ceo.emptyActivity}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.common.when}</th>
                <th>{t.common.who}</th>
                <th>{t.common.summary}</th>
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
  const { t } = useAdminLocale()
  return (
    <div>
      <div className="admin-crumb">{t.ceo.crumbPlaces}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.ceo.titlePlaces}</h1>
          <p>{t.ceo.ledePlaces}</p>
        </div>
      </div>
      <div className="admin-panel">
        {store.places.length === 0 ? (
          <div className="admin-empty">{t.ceo.emptyPlaces}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.common.name}</th>
                <th>{t.common.whoseWork}</th>
                <th>{t.common.status}</th>
                <th>{t.common.updated}</th>
              </tr>
            </thead>
            <tbody>
              {store.places.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/ceo/places/${p.id}`}>
                      {p.nameEn || t.common.untitled}
                    </Link>
                  </td>
                  <td>
                    <span className="admin-owner-pill">{p.ownerLabel}</span>
                  </td>
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
  const { t } = useAdminLocale()
  if (!session) return null

  const pending = store.finance.filter((f) => f.status === 'pending_approval')
  const others = store.finance.filter((f) => f.status !== 'pending_approval')

  async function decide(id: string, status: 'approved' | 'rejected') {
    if (!session) return
    const draft = store.finance.find((f) => f.id === id)
    const verb = status === 'approved' ? t.ceo.approved : t.ceo.rejected
    try {
      await setFinanceStatusRemote(id, status, {
        action: `finance.${status}`,
        summary: `${verb} ${draft?.category || id} (${draft?.amountOmr || '?'} OMR)`,
      })
    } catch (e) {
      alert(e instanceof Error ? e.message : t.common.updateFailed)
    }
  }

  return (
    <div>
      <div className="admin-crumb">{t.ceo.crumbFinance}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.ceo.titleFinance}</h1>
          <p>{t.ceo.ledeFinance}</p>
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="admin-panel admin-empty">{t.ceo.noPending}</div>
      ) : (
        pending.map((f) => (
          <div key={f.id} className="admin-panel" style={{ marginBottom: '0.85rem' }}>
            <div className="admin-page-head" style={{ marginBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', margin: 0 }}>{f.category}</h2>
                <p>
                  <StatusChip status={f.status} /> · {t.ceo.whoForPrefix}{' '}
                  {f.whoFor}
                </p>
              </div>
              <div className="admin-stat" style={{ minWidth: '140px' }}>
                <div className="n">{f.amountOmr || t.common.emDash} </div>
                <div className="l">{t.ceo.pricingOmr}</div>
              </div>
            </div>
            <p style={{ margin: '0 0 0.85rem', lineHeight: 1.45 }}>{f.description}</p>
            <div className="admin-actions" style={{ marginTop: 0 }}>
              <button
                type="button"
                className="admin-btn"
                onClick={() => void decide(f.id, 'approved')}
              >
                {t.ceo.approve}
                {f.amountOmr ? ` (${f.amountOmr} OMR)` : ''}
              </button>
              <button
                type="button"
                className="admin-btn danger"
                onClick={() => void decide(f.id, 'rejected')}
              >
                {t.ceo.reject}
              </button>
            </div>
          </div>
        ))
      )}

      {others.length > 0 && (
        <div className="admin-panel" style={{ marginTop: '1rem' }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>
            {t.ceo.otherDrafts}
          </h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.common.category}</th>
                <th>{t.common.whoFor}</th>
                <th>{t.ceo.pricingOmr}</th>
                <th>{t.common.status}</th>
              </tr>
            </thead>
            <tbody>
              {others.map((f) => (
                <tr key={f.id}>
                  <td>{f.category}</td>
                  <td>{f.whoFor}</td>
                  <td>
                    <strong>{f.amountOmr || t.common.emDash}</strong>
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
  const { t } = useAdminLocale()
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
      setMsg(t.ceo.jobEmpty)
      return
    }
    try {
      await saveMemberMeta(id, { jobTitle })
      setJobDrafts((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      setMsg(t.ceo.jobSaved)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : t.common.saveFailed)
    }
  }

  async function savePassword(id: string) {
    const password = (draftPasswords[id] || '').trim()
    if (password.length < 6) {
      setMsg(t.ceo.passwordShort)
      return
    }
    try {
      await saveMemberPassword(id, password)
      setDraftPasswords((prev) => ({ ...prev, [id]: '' }))
      setMsg(t.ceo.passwordUpdated)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : t.ceo.passwordUpdateFailed)
    }
  }

  return (
    <div>
      <div className="admin-crumb">{t.ceo.crumbTeam}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.ceo.titleTeam}</h1>
          <p>{t.ceo.ledeTeam}</p>
        </div>
      </div>
      {msg && <div className="admin-banner info">{msg}</div>}
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t.ceo.colName}</th>
              <th>{t.ceo.colJob}</th>
              <th>{t.ceo.colPassword}</th>
              <th>{t.ceo.colAdmin}</th>
              <th>{t.ceo.colActive}</th>
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
                        {t.common.save}
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
                        placeholder={t.ceo.setNewPassword}
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
                        {t.common.set}
                      </button>
                    </div>
                  ) : (
                    <span className="admin-muted">{t.ceo.externalNoDash}</span>
                  )}
                </td>
                <td>{m.hasAdmin ? t.common.yes : t.common.no}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={m.isActive}
                    disabled={!m.hasAdmin}
                    onChange={(e) =>
                      void saveMemberMeta(m.id, { isActive: e.target.checked })
                        .then(() => setMsg(t.ceo.activeSaved))
                        .catch((err) =>
                          setMsg(
                            err instanceof Error ? err.message : t.common.saveFailed,
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

function formatDuration(ms: number | null, emDash: string): string {
  if (ms == null || Number.isNaN(ms) || ms < 0) return emDash
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
  const { t } = useAdminLocale()
  const pipeline = publishPipeline(store.activity)

  return (
    <div>
      <div className="admin-crumb">{t.ceo.crumbActivity}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.ceo.titleActivity}</h1>
          <p>{t.ceo.ledeActivity}</p>
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>
          {t.ceo.publishPipeline}
        </h3>
        {pipeline.length === 0 ? (
          <div className="admin-empty">{t.ceo.emptyPipeline}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.ceo.colPlace}</th>
                <th>{t.ceo.draftedBy}</th>
                <th>{t.ceo.safetyClearedBy}</th>
                <th>{t.ceo.publishedBy}</th>
                <th>{t.ceo.timeToPublish}</th>
              </tr>
            </thead>
            <tbody>
              {pipeline.map((row) => (
                <tr key={row.place}>
                  <td>{row.place}</td>
                  <td>{row.draftedBy || t.common.emDash}</td>
                  <td>{row.safetyBy || t.common.emDash}</td>
                  <td>{row.publishedBy || t.common.emDash}</td>
                  <td>{formatDuration(row.timeToPublishMs, t.common.emDash)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-panel">
        {store.activity.length === 0 ? (
          <div className="admin-empty">{t.ceo.emptyFeed}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.common.when}</th>
                <th>{t.common.who}</th>
                <th>{t.common.action}</th>
                <th>{t.common.summary}</th>
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
  const { t } = useAdminLocale()
  return (
    <div>
      <div className="admin-crumb">{t.ceo.crumbAnalytics}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.ceo.titleAnalytics}</h1>
          <p>{t.ceo.ledeAnalytics}</p>
        </div>
      </div>
      <div className="admin-stats">
        <div className="admin-stat">
          <div className="n">{waitlist.length}</div>
          <div className="l">{t.ceo.waitlistSignups}</div>
        </div>
      </div>
      <div className="admin-panel admin-coming">
        <p className="admin-muted">{t.ceo.noCharts}</p>
      </div>
    </div>
  )
}

export function CeoWaitlist() {
  const { waitlist } = useAdmin()
  const { t } = useAdminLocale()
  return (
    <div>
      <div className="admin-crumb">{t.ceo.crumbWaitlist}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.ceo.titleWaitlist}</h1>
          <p>{t.ceo.ledeWaitlist}</p>
        </div>
      </div>
      <div className="admin-panel">
        {waitlist.length === 0 ? (
          <div className="admin-empty">{t.ceo.emptyWaitlist}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.common.email}</th>
                <th>{t.common.joined}</th>
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
