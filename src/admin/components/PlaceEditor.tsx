import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAdmin } from '../AdminContext'
import {
  daCanSubmit,
  deletePlace,
  pushActivity,
  safetyComplete,
  upsertPlace,
} from '../store'
import type { Place, PlacePhoto, RoleKey, VehicleAccess } from '../types'
import { StatusChip } from './StatusChip'

type Mode = 'da' | 'safety' | 'ceo' | 'readonly'

const VEHICLE_OPTIONS: { value: VehicleAccess; label: string }[] = [
  { value: 'two_wd', label: '2WD OK' },
  { value: 'four_wd', label: '4WD recommended' },
  { value: 'four_x4_recommended', label: '4x4 recommended' },
  { value: 'other', label: 'Other / walk-in' },
]

function modeFor(role: RoleKey, place: Place, memberId: string): Mode {
  if (role === 'safety') return 'safety'
  if (role === 'ceo') return 'ceo'
  if (role === 'da1' || role === 'da2') {
    return place.createdBy === memberId ? 'da' : 'readonly'
  }
  return 'readonly'
}

export function PlaceEditor({
  placeId,
  backTo,
}: {
  placeId: string
  backTo: string
}) {
  const { session, store, updateStore } = useAdmin()
  const navigate = useNavigate()
  const original = store.places.find((p) => p.id === placeId)
  const [place, setPlace] = useState<Place | null>(() =>
    original ? structuredClone(original) : null,
  )
  const [tab, setTab] = useState<'basics' | 'access' | 'photos' | 'safety'>(
    'basics',
  )
  const [msg, setMsg] = useState<string | null>(null)

  const mode = useMemo(() => {
    if (!session || !place) return 'readonly' as Mode
    return modeFor(session.roleKey, place, session.memberId)
  }, [session, place])

  if (!session || !place) {
    return (
      <div className="admin-panel">
        <p>Place not found.</p>
        <Link to={backTo}>Back</Link>
      </div>
    )
  }

  const daEditable = mode === 'da' || mode === 'ceo'
  const safetyEditable = mode === 'safety' || mode === 'ceo'
  const showSafetyTab = mode !== 'da'

  function patch(partial: Partial<Place>) {
    setPlace((p) => (p ? { ...p, ...partial } : p))
  }

  function patchSafety(partial: Partial<Place['safety']>) {
    setPlace((p) =>
      p ? { ...p, safety: { ...p.safety, ...partial } } : p,
    )
  }

  function save(extra?: Partial<Place>, activity?: string) {
    if (!place || !session) return
    const base = place
    const actor = session
    let next: Place = {
      ...base,
      ...extra,
      updatedAt: new Date().toISOString(),
    }

    // Editing published → unpublish back to safety
    if (
      base.status === 'published' &&
      (mode === 'da' || mode === 'ceo') &&
      !extra?.status
    ) {
      next = { ...next, status: 'awaiting_safety' }
      setMsg('Published place edited — returned to Awaiting safety.')
    }

    let storeNext = upsertPlace(store, next)
    if (activity) {
      storeNext = pushActivity(
        storeNext,
        actor.displayName,
        'place.saved',
        activity,
      )
    }
    updateStore(storeNext)
    setPlace(next)
    if (!msg) setMsg('Saved (local mock).')
  }

  function submitSafety() {
    if (!place) return
    const err = daCanSubmit(place)
    if (err) {
      setMsg(err)
      return
    }
    save(
      { status: 'awaiting_safety' },
      `Submitted ${place.nameEn || 'place'} for safety`,
    )
    setMsg('Submitted → Awaiting safety.')
  }

  function markReady() {
    if (!place || !session) return
    const err = safetyComplete(place)
    if (err) {
      setMsg(err)
      setTab('safety')
      return
    }
    const next: Place = {
      ...place,
      safety: { ...place.safety, completed: true },
      status: 'ready',
      updatedAt: new Date().toISOString(),
    }
    let storeNext = upsertPlace(store, next)
    storeNext = pushActivity(
      storeNext,
      session.displayName,
      'safety.ready',
      `Marked ${next.nameEn} Ready`,
    )
    updateStore(storeNext)
    setPlace(next)
    setMsg('Marked Ready.')
  }

  function publish() {
    if (!place) return
    if (place.status !== 'ready') {
      setMsg('Only Ready places can be published.')
      return
    }
    save({ status: 'published' }, `Published ${place.nameEn}`)
    setMsg('Published.')
  }

  function sendBack(status: 'needs_changes' | 'rejected') {
    if (!place) return
    save(
      { status },
      `Set ${place.nameEn} to ${status.replace('_', ' ')}`,
    )
  }

  function onMockUpload(files: FileList | null) {
    if (!place || !files?.length || !daEditable) return
    const remaining = 10 - place.photos.length
    if (remaining <= 0) {
      setMsg('Maximum 10 photos.')
      return
    }
    const existing = place.photos
    const added: PlacePhoto[] = Array.from(files)
      .slice(0, remaining)
      .map((file, i) => ({
        id: `ph-${Date.now()}-${i}`,
        url: URL.createObjectURL(file),
        isCover: existing.length === 0 && i === 0,
        captionEn: file.name,
      }))
    patch({ photos: [...existing, ...added] })
  }

  function setCover(id: string) {
    if (!place) return
    patch({
      photos: place.photos.map((p) => ({ ...p, isCover: p.id === id })),
    })
  }

  function removePhoto(id: string) {
    if (!place) return
    const photos = place.photos.filter((p) => p.id !== id)
    if (photos.length && !photos.some((p) => p.isCover)) {
      photos[0] = { ...photos[0], isCover: true }
    }
    patch({ photos })
  }

  function onDelete() {
    if (!place || !session) return
    if (!confirm('Delete this place?')) return
    const can =
      mode === 'ceo' ||
      (mode === 'da' && place.createdBy === session.memberId)
    if (!can) return
    updateStore(
      pushActivity(
        deletePlace(store, place.id),
        session.displayName,
        'place.deleted',
        `Deleted ${place.nameEn || place.id}`,
      ),
    )
    navigate(backTo)
  }

  const tabs: { id: typeof tab; label: string }[] = [
    { id: 'basics', label: 'Basics' },
    { id: 'access', label: 'Access' },
    { id: 'photos', label: 'Photos' },
  ]
  if (showSafetyTab) tabs.push({ id: 'safety', label: 'Safety' })

  return (
    <div>
      <div className="admin-crumb">
        <Link to={backTo}>Places</Link> / {place.nameEn || 'Untitled'}
      </div>
      <div className="admin-page-head">
        <div>
          <h1>{place.nameEn || 'Untitled place'}</h1>
          <p>
            <StatusChip status={place.status} /> · Owned by {place.ownerLabel}
          </p>
        </div>
        <div className="admin-actions" style={{ marginTop: 0 }}>
          {daEditable && (
            <button
              type="button"
              className="admin-btn secondary"
              onClick={() => save(undefined, `Saved ${place.nameEn || 'place'}`)}
            >
              Save
            </button>
          )}
          {mode === 'da' && place.status === 'draft' && (
            <button type="button" className="admin-btn" onClick={submitSafety}>
              Submit for safety
            </button>
          )}
          {(mode === 'safety' || mode === 'ceo') &&
            (place.status === 'awaiting_safety' ||
              place.status === 'needs_changes') && (
              <>
                <button type="button" className="admin-btn" onClick={markReady}>
                  Mark Ready
                </button>
                <button
                  type="button"
                  className="admin-btn sand"
                  onClick={() => sendBack('needs_changes')}
                >
                  Needs changes
                </button>
                <button
                  type="button"
                  className="admin-btn danger"
                  onClick={() => sendBack('rejected')}
                >
                  Reject
                </button>
              </>
            )}
          {mode === 'ceo' && place.status === 'ready' && (
            <button type="button" className="admin-btn" onClick={publish}>
              Publish
            </button>
          )}
          {(mode === 'ceo' || mode === 'da') && (
            <button type="button" className="admin-btn danger" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </div>

      {mode === 'readonly' && (
        <div className="admin-banner">
          View only — owned by {place.ownerLabel}. You can open teammates’
          places but not edit them.
        </div>
      )}
      {mode === 'safety' && (
        <div className="admin-banner info">
          DA fields are read-only. Edit the Safety tab, then Mark Ready.
        </div>
      )}
      {msg && <div className="admin-banner info">{msg}</div>}

      <div className="admin-panel">
        <div className="admin-tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? 'active' : undefined}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'basics' && (
          <div className="admin-form-grid">
            <Field
              label="Name (EN)"
              value={place.nameEn}
              disabled={!daEditable}
              onChange={(v) => patch({ nameEn: v })}
            />
            <Field
              label="الاسم (AR)"
              value={place.nameAr}
              disabled={!daEditable}
              dir="rtl"
              onChange={(v) => patch({ nameAr: v })}
            />
            <Field
              label="Summary (EN)"
              value={place.summaryEn}
              disabled={!daEditable}
              textarea
              className="full"
              onChange={(v) => patch({ summaryEn: v })}
            />
            <Field
              label="الملخص (AR)"
              value={place.summaryAr}
              disabled={!daEditable}
              textarea
              dir="rtl"
              className="full"
              onChange={(v) => patch({ summaryAr: v })}
            />
            <Field
              label="Region"
              value={place.region}
              disabled={!daEditable}
              onChange={(v) => patch({ region: v })}
            />
            <Field
              label="Difficulty"
              value={place.difficulty}
              disabled={!daEditable}
              onChange={(v) => patch({ difficulty: v })}
            />
            <Field
              label="Season (EN)"
              value={place.seasonEn}
              disabled={!daEditable}
              onChange={(v) => patch({ seasonEn: v })}
            />
            <Field
              label="الموسم (AR)"
              value={place.seasonAr}
              disabled={!daEditable}
              dir="rtl"
              onChange={(v) => patch({ seasonAr: v })}
            />
            <Field
              label="Distance (km)"
              value={place.distanceKm}
              disabled={!daEditable}
              onChange={(v) => patch({ distanceKm: v })}
            />
            <Field
              label="Duration"
              value={place.durationText}
              disabled={!daEditable}
              onChange={(v) => patch({ durationText: v })}
            />
            <div className="admin-field full">
              <label>
                <input
                  type="checkbox"
                  checked={place.fragile}
                  disabled={!daEditable}
                  onChange={(e) => patch({ fragile: e.target.checked })}
                />{' '}
                Fragile place?
              </label>
            </div>
          </div>
        )}

        {tab === 'access' && (
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Vehicle access</label>
              <select
                value={place.vehicleAccess}
                disabled={!daEditable}
                onChange={(e) =>
                  patch({ vehicleAccess: e.target.value as VehicleAccess })
                }
              >
                {VEHICLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div />
            <Field
              label="Access notes (EN)"
              value={place.accessNotesEn}
              disabled={!daEditable}
              textarea
              className="full"
              onChange={(v) => patch({ accessNotesEn: v })}
            />
            <Field
              label="ملاحظات الوصول (AR)"
              value={place.accessNotesAr}
              disabled={!daEditable}
              textarea
              dir="rtl"
              className="full"
              onChange={(v) => patch({ accessNotesAr: v })}
            />
            <Field
              label="Trailhead / parking (EN)"
              value={place.trailheadNotesEn}
              disabled={!daEditable}
              textarea
              className="full"
              onChange={(v) => patch({ trailheadNotesEn: v })}
            />
            <Field
              label="نقطة البداية / الموقف (AR)"
              value={place.trailheadNotesAr}
              disabled={!daEditable}
              textarea
              dir="rtl"
              className="full"
              onChange={(v) => patch({ trailheadNotesAr: v })}
            />
          </div>
        )}

        {tab === 'photos' && (
          <div>
            <p className="admin-muted" style={{ marginBottom: '0.75rem' }}>
              Mock upload only (no Supabase). Need 2–10 photos and one cover.
              Currently {place.photos.length}/10.
            </p>
            {daEditable && (
              <div className="admin-actions" style={{ marginTop: 0 }}>
                <label className="admin-btn secondary" style={{ cursor: 'pointer' }}>
                  Add photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => {
                      onMockUpload(e.target.files)
                      e.target.value = ''
                    }}
                  />
                </label>
              </div>
            )}
            <div className="admin-photo-grid" style={{ marginTop: '0.85rem' }}>
              {place.photos.map((ph) => (
                <div key={ph.id} className="admin-photo">
                  <img src={ph.url} alt={ph.captionEn || 'Place photo'} />
                  <div className="meta">
                    {ph.isCover ? (
                      <strong>Cover</strong>
                    ) : daEditable ? (
                      <button
                        type="button"
                        className="admin-btn secondary"
                        style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem' }}
                        onClick={() => setCover(ph.id)}
                      >
                        Set cover
                      </button>
                    ) : (
                      <span>Photo</span>
                    )}
                    {daEditable && (
                      <button
                        type="button"
                        className="admin-btn danger"
                        style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem' }}
                        onClick={() => removePhoto(ph.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'safety' && (
          <div className="admin-form-grid">
            {(
              [
                ['hazards', 'Hazards'],
                ['heat', 'Heat'],
                ['flood', 'Flood'],
                ['water', 'Water'],
                ['signal', 'Signal'],
                ['emergency', 'Emergency'],
                ['whenNotToGo', 'When not to go'],
                ['kit', 'Kit'],
              ] as const
            ).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={place.safety[key]}
                disabled={!safetyEditable}
                textarea
                className="full"
                onChange={(v) => patchSafety({ [key]: v })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  disabled,
  textarea,
  dir,
  className,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  textarea?: boolean
  dir?: string
  className?: string
}) {
  return (
    <div className={`admin-field ${className || ''}`}>
      <label>{label}</label>
      {textarea ? (
        <textarea
          value={value}
          disabled={disabled}
          dir={dir}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          value={value}
          disabled={disabled}
          dir={dir}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}
