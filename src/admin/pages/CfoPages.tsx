import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAdmin } from '../AdminContext'
import { useAdminLocale } from '../AdminLocale'
import { PlaceEditor } from '../components/PlaceEditor'
import { StatusChip } from '../components/StatusChip'
import { blankFinance } from '../mockData'
import type { FinanceDraft } from '../types'

export function CfoDrafts() {
  const { session, store, saveFinance } = useAdmin()
  const { t } = useAdminLocale()
  const navigate = useNavigate()
  if (!session) return null

  async function create() {
    if (!session) return
    const draft = blankFinance(session.memberId)
    try {
      await saveFinance(draft)
      navigate(`/admin/cfo/drafts/${draft.id}`)
    } catch (e) {
      alert(e instanceof Error ? e.message : t.common.createFailed)
    }
  }

  return (
    <div>
      <div className="admin-crumb">{t.cfo.crumbDrafts}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.cfo.titleDrafts}</h1>
          <p>{t.cfo.ledeDrafts}</p>
        </div>
        <button type="button" className="admin-btn" onClick={() => void create()}>
          {t.cfo.newDraft}
        </button>
      </div>
      <div className="admin-panel">
        {store.finance.length === 0 ? (
          <div className="admin-empty">{t.cfo.emptyDrafts}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.common.category}</th>
                <th>{t.common.whoFor}</th>
                <th>{t.common.amountOmr}</th>
                <th>{t.common.status}</th>
              </tr>
            </thead>
            <tbody>
              {store.finance.map((f) => (
                <tr key={f.id}>
                  <td>
                    <Link to={`/admin/cfo/drafts/${f.id}`}>
                      {f.category || t.common.untitled}
                    </Link>
                  </td>
                  <td>{f.whoFor || t.common.emDash}</td>
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
        )}
      </div>
    </div>
  )
}

export function CfoDraftEditor() {
  const { id } = useParams()
  const { session, store, saveFinance } = useAdmin()
  const { t } = useAdminLocale()
  const existing = store.finance.find((f) => f.id === id)
  const [draft, setDraft] = useState<FinanceDraft | null>(() =>
    existing ? structuredClone(existing) : null,
  )
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    const next = store.finance.find((f) => f.id === id)
    if (next) setDraft(structuredClone(next))
  }, [store.finance, id])

  if (!session || !draft) {
    return (
      <div className="admin-panel">
        <p>{t.cfo.draftNotFound}</p>
        <Link to="/admin/cfo">{t.common.back}</Link>
      </div>
    )
  }

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!draft) return
    const next: FinanceDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    }
    try {
      await saveFinance(next)
      setDraft(next)
      setMsg(t.common.savedSupabase)
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t.common.saveFailed)
    }
  }

  async function submitApproval() {
    if (!draft || !session) return
    if (!draft.category.trim() || !draft.whoFor.trim() || !draft.description.trim()) {
      setMsg(t.cfo.requiredFields)
      return
    }
    if (!draft.amountOmr.trim()) {
      setMsg(t.cfo.pricingRequired)
      return
    }
    const next: FinanceDraft = {
      ...draft,
      status: 'pending_approval',
      updatedAt: new Date().toISOString(),
    }
    try {
      await saveFinance(next, {
        action: 'finance.submitted',
        summary: `Submitted ${next.category} for approval`,
      })
      setDraft(next)
      setMsg(t.cfo.submittedCeo)
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t.common.submitFailed)
    }
  }

  return (
    <div>
      <div className="admin-crumb">
        <Link to="/admin/cfo">{t.nav.budgetDrafts}</Link> /{' '}
        {draft.category || t.common.untitled}
      </div>
      <div className="admin-page-head">
        <div>
          <h1>{draft.category || t.common.untitledDraft}</h1>
          <p>
            <StatusChip status={draft.status} />
          </p>
        </div>
      </div>
      {msg && <div className="admin-banner info">{msg}</div>}
      <form className="admin-panel" onSubmit={(e) => void onSave(e)}>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>{t.common.category}</label>
            <input
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>{t.common.whoFor}</label>
            <input
              value={draft.whoFor}
              onChange={(e) => setDraft({ ...draft, whoFor: e.target.value })}
            />
          </div>
          <div className="admin-field full">
            <label>{t.common.description}</label>
            <textarea
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
            />
          </div>
          <div className="admin-field">
            <label>{t.cfo.pricingLabel}</label>
            <input
              value={draft.amountOmr}
              onChange={(e) => setDraft({ ...draft, amountOmr: e.target.value })}
              placeholder={t.cfo.pricingPlaceholder}
            />
          </div>
        </div>
        <div className="admin-actions">
          <button type="submit" className="admin-btn secondary">
            {t.common.save}
          </button>
          {draft.status === 'draft' && (
            <button
              type="button"
              className="admin-btn"
              onClick={() => void submitApproval()}
            >
              {t.cfo.submitApproval}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export function CfoPlaces() {
  const { store } = useAdmin()
  const { t } = useAdminLocale()
  return (
    <div>
      <div className="admin-crumb">{t.cfo.crumbPlaces}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.cfo.titlePlaces}</h1>
          <p>{t.cfo.ledePlaces}</p>
        </div>
      </div>
      <div className="admin-panel">
        {store.places.length === 0 ? (
          <div className="admin-empty">{t.cfo.emptyPlaces}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.common.name}</th>
                <th>{t.common.whoseWork}</th>
                <th>{t.common.region}</th>
                <th>{t.common.status}</th>
              </tr>
            </thead>
            <tbody>
              {store.places.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/cfo/places/${p.id}`}>
                      {p.nameEn || t.common.untitled}
                    </Link>
                  </td>
                  <td>
                    <span className="admin-owner-pill">{p.ownerLabel}</span>
                  </td>
                  <td>{p.region || t.common.emDash}</td>
                  <td>
                    <StatusChip status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export function CfoPlaceDetail({ id }: { id: string }) {
  return <PlaceEditor placeId={id} backTo="/admin/cfo/places" />
}

export function CfoActivity() {
  const { store } = useAdmin()
  const { t } = useAdminLocale()
  const worked = store.members.filter((m) => m.hasAdmin && m.workedThisWeek)
  const idle = store.members.filter((m) => m.hasAdmin && !m.workedThisWeek)

  return (
    <div>
      <div className="admin-crumb">{t.cfo.crumbActivity}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.cfo.titleActivity}</h1>
          <p>{t.cfo.ledeActivity}</p>
        </div>
      </div>
      <div className="admin-split">
        <div className="admin-panel">
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>
            {t.cfo.whoWorked}
          </h3>
          {worked.length === 0 ? (
            <div className="admin-empty">{t.cfo.noLogins}</div>
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
            {t.cfo.whoDidnt}
          </h3>
          {idle.length === 0 ? (
            <div className="admin-empty">{t.cfo.everyoneLogged}</div>
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
          {t.cfo.recentActivity}
        </h3>
        {store.activity.length === 0 ? (
          <div className="admin-empty">{t.cfo.emptyActivity}</div>
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
              {store.activity.map((a) => (
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

export function CfoPublishedGlance() {
  const { store } = useAdmin()
  const { t } = useAdminLocale()
  const published = store.places.filter((p) => p.status === 'published')
  return (
    <div>
      <div className="admin-crumb">{t.cfo.crumbPublished}</div>
      <div className="admin-page-head">
        <div>
          <h1>{t.cfo.titlePublished}</h1>
          <p>{t.cfo.ledePublished}</p>
        </div>
      </div>
      <div className="admin-panel">
        {published.length === 0 ? (
          <div className="admin-empty">{t.cfo.emptyPublished}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.common.name}</th>
                <th>{t.common.region}</th>
                <th>{t.common.status}</th>
              </tr>
            </thead>
            <tbody>
              {published.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/cfo/places/${p.id}`}>
                      {p.nameEn || t.common.untitled}
                    </Link>
                  </td>
                  <td>{p.region || t.common.emDash}</td>
                  <td>
                    <StatusChip status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export function CfoSponsors() {
  const { t } = useAdminLocale()
  return (
    <div>
      <div className="admin-crumb">{t.cfo.crumbSponsors}</div>
      <div className="admin-panel admin-coming">
        <h2>{t.cfo.sponsorsTitle}</h2>
        <p>{t.cfo.sponsorsComing}</p>
      </div>
    </div>
  )
}
