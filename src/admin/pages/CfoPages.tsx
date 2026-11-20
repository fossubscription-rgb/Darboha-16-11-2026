import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAdmin } from '../AdminContext'
import { PlaceEditor } from '../components/PlaceEditor'
import { StatusChip } from '../components/StatusChip'
import { blankFinance } from '../mockData'
import type { FinanceDraft } from '../types'

export function CfoDrafts() {
  const { session, store, saveFinance } = useAdmin()
  const navigate = useNavigate()
  if (!session) return null

  async function create() {
    if (!session) return
    const draft = blankFinance(session.memberId)
    try {
      await saveFinance(draft)
      navigate(`/admin/cfo/drafts/${draft.id}`)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Create failed')
    }
  }

  return (
    <div>
      <div className="admin-crumb">CFO / Budget drafts</div>
      <div className="admin-page-head">
        <div>
          <h1>Budget & pricing drafts</h1>
          <p>Category · who-for · description. CEO approves.</p>
        </div>
        <button type="button" className="admin-btn" onClick={() => void create()}>
          New draft
        </button>
      </div>
      <div className="admin-panel">
        {store.finance.length === 0 ? (
          <div className="admin-empty">
            No budget drafts yet — create the first line when you need CEO approval.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Who for</th>
                <th>Amount (OMR)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {store.finance.map((f) => (
                <tr key={f.id}>
                  <td>
                    <Link to={`/admin/cfo/drafts/${f.id}`}>
                      {f.category || 'Untitled'}
                    </Link>
                  </td>
                  <td>{f.whoFor || '—'}</td>
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
        )}
      </div>
    </div>
  )
}

export function CfoDraftEditor() {
  const { id } = useParams()
  const { session, store, saveFinance } = useAdmin()
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
        <p>Draft not found.</p>
        <Link to="/admin/cfo">Back</Link>
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
      setMsg('Saved to Supabase.')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed')
    }
  }

  async function submitApproval() {
    if (!draft || !session) return
    if (!draft.category.trim() || !draft.whoFor.trim() || !draft.description.trim()) {
      setMsg('Category, who-for, and description are required.')
      return
    }
    if (!draft.amountOmr.trim()) {
      setMsg('Pricing (OMR) is required before submitting for CEO approval.')
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
      setMsg('Submitted for CEO approval.')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Submit failed')
    }
  }

  return (
    <div>
      <div className="admin-crumb">
        <Link to="/admin/cfo">Budget drafts</Link> / {draft.category || 'Untitled'}
      </div>
      <div className="admin-page-head">
        <div>
          <h1>{draft.category || 'Untitled draft'}</h1>
          <p>
            <StatusChip status={draft.status} />
          </p>
        </div>
      </div>
      {msg && <div className="admin-banner info">{msg}</div>}
      <form className="admin-panel" onSubmit={(e) => void onSave(e)}>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Category</label>
            <input
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Who for</label>
            <input
              value={draft.whoFor}
              onChange={(e) => setDraft({ ...draft, whoFor: e.target.value })}
            />
          </div>
          <div className="admin-field full">
            <label>Description</label>
            <textarea
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
            />
          </div>
          <div className="admin-field">
            <label>Pricing (OMR) — required for approval</label>
            <input
              value={draft.amountOmr}
              onChange={(e) => setDraft({ ...draft, amountOmr: e.target.value })}
              placeholder="e.g. 45"
            />
          </div>
        </div>
        <div className="admin-actions">
          <button type="submit" className="admin-btn secondary">
            Save
          </button>
          {draft.status === 'draft' && (
            <button
              type="button"
              className="admin-btn"
              onClick={() => void submitApproval()}
            >
              Submit for approval
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export function CfoPlaces() {
  const { store } = useAdmin()
  return (
    <div>
      <div className="admin-crumb">CFO / VP · Places</div>
      <div className="admin-page-head">
        <div>
          <h1>Places (read-only)</h1>
          <p>
            VP glance — open any place to view Basics / Access / Photos / Safety.
            No edits.
          </p>
        </div>
      </div>
      <div className="admin-panel">
        {store.places.length === 0 ? (
          <div className="admin-empty">
            No places yet — empty until analysts add the first draft.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Region</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {store.places.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/cfo/places/${p.id}`}>
                      {p.nameEn || 'Untitled'}
                    </Link>
                  </td>
                  <td>{p.ownerLabel}</td>
                  <td>{p.region || '—'}</td>
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
  const worked = store.members.filter((m) => m.hasAdmin && m.workedThisWeek)
  const idle = store.members.filter((m) => m.hasAdmin && !m.workedThisWeek)

  return (
    <div>
      <div className="admin-crumb">CFO / VP · Activity</div>
      <div className="admin-page-head">
        <div>
          <h1>Team activity</h1>
          <p>Who’s been working — read-only VP view from activity_log.</p>
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
          <div className="admin-empty">Activity feed is empty.</div>
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
  const published = store.places.filter((p) => p.status === 'published')
  return (
    <div>
      <div className="admin-crumb">CFO / Published</div>
      <div className="admin-page-head">
        <div>
          <h1>Published glance</h1>
          <p>Read-only — what’s live on the marketing story.</p>
        </div>
      </div>
      <div className="admin-panel">
        {published.length === 0 ? (
          <div className="admin-empty">
            Nothing published yet — the public trails section stays empty until a place is published.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Region</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {published.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/admin/cfo/places/${p.id}`}>
                      {p.nameEn || 'Untitled'}
                    </Link>
                  </td>
                  <td>{p.region || '—'}</td>
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
  return (
    <div>
      <div className="admin-crumb">CFO / Sponsors</div>
      <div className="admin-panel admin-coming">
        <h2>Sponsors</h2>
        <p>Coming later إن شاء الله</p>
      </div>
    </div>
  )
}
