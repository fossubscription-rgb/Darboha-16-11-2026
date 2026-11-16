import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAdmin } from '../AdminContext'
import { StatusChip } from '../components/StatusChip'
import { blankFinance } from '../mockData'
import { pushActivity, upsertFinance } from '../store'
import type { FinanceDraft } from '../types'

export function CfoDrafts() {
  const { session, store, updateStore } = useAdmin()
  const navigate = useNavigate()
  if (!session) return null

  function create() {
    if (!session) return
    const draft = blankFinance(session.memberId)
    updateStore(upsertFinance(store, draft))
    navigate(`/admin/cfo/drafts/${draft.id}`)
  }

  return (
    <div>
      <div className="admin-crumb">CFO / Budget drafts</div>
      <div className="admin-page-head">
        <div>
          <h1>Budget & pricing drafts</h1>
          <p>Category · who-for · description. CEO approves.</p>
        </div>
        <button type="button" className="admin-btn" onClick={create}>
          New draft
        </button>
      </div>
      <div className="admin-panel">
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
                <td>{f.amountOmr || '—'}</td>
                <td>
                  <StatusChip status={f.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function CfoDraftEditor() {
  const { id } = useParams()
  const { session, store, updateStore } = useAdmin()
  const existing = store.finance.find((f) => f.id === id)
  const [draft, setDraft] = useState<FinanceDraft | null>(() =>
    existing ? structuredClone(existing) : null,
  )
  const [msg, setMsg] = useState<string | null>(null)

  if (!session || !draft) {
    return (
      <div className="admin-panel">
        <p>Draft not found.</p>
        <Link to="/admin/cfo">Back</Link>
      </div>
    )
  }

  function onSave(e: FormEvent) {
    e.preventDefault()
    if (!draft) return
    const next: FinanceDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    }
    updateStore(upsertFinance(store, next))
    setDraft(next)
    setMsg('Saved (local mock).')
  }

  function submitApproval() {
    if (!draft || !session) return
    if (!draft.category.trim() || !draft.whoFor.trim() || !draft.description.trim()) {
      setMsg('Category, who-for, and description are required.')
      return
    }
    const next: FinanceDraft = {
      ...draft,
      status: 'pending_approval',
      updatedAt: new Date().toISOString(),
    }
    updateStore(
      pushActivity(
        upsertFinance(store, next),
        session.displayName,
        'finance.submitted',
        `Submitted ${next.category} for approval`,
      ),
    )
    setDraft(next)
    setMsg('Submitted for CEO approval.')
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
      <form className="admin-panel" onSubmit={onSave}>
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
            <label>Amount (OMR) — optional</label>
            <input
              value={draft.amountOmr}
              onChange={(e) => setDraft({ ...draft, amountOmr: e.target.value })}
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
              onClick={submitApproval}
            >
              Submit for approval
            </button>
          )}
        </div>
      </form>
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
                <td>{p.nameEn}</td>
                <td>{p.region}</td>
                <td>
                  <StatusChip status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
