import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAdmin } from '../AdminContext'
import {
  daCanSubmit,
  daRequiredProgress,
  safetyComplete,
  sortPhotosCoverFirst,
} from '../store'
import { DIFFICULTY_OPTIONS, MONTHS, SAFETY_DROPDOWNS } from '../constants'
import type {
  Place,
  PlaceAmenity,
  PlacePhoto,
  RoleKey,
  VehicleAccess,
} from '../types'
import { StatusChip } from './StatusChip'
import { ClinicMapPicker } from './ClinicMapPicker'
import { AmenityMapPicker } from './AmenityMapPicker'

type Mode = 'da' | 'safety' | 'ceo' | 'readonly'

const VEHICLE_OPTIONS: { value: VehicleAccess; label: string }[] = [
  { value: 'two_wd', label: '2WD OK' },
  { value: 'four_wd', label: '4WD recommended' },
  { value: 'four_x4_recommended', label: '4x4 recommended' },
  { value: 'other', label: 'Other / walk-in' },
]

const AMENITY_KINDS: { value: PlaceAmenity['kind']; label: string }[] = [
  { value: 'cafe', label: 'Cafe / coffee' },
  { value: 'shop', label: 'Shop / services' },
  { value: 'restroom', label: 'Restroom' },
  { value: 'water', label: 'Water point' },
  { value: 'parking', label: 'Parking' },
  { value: 'other', label: 'Other' },
]

function modeFor(role: RoleKey, place: Place, memberId: string): Mode {
  if (role === 'safety') return 'safety'
  if (role === 'ceo') return 'ceo'
  if (role === 'cfo') return 'readonly'
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
  const { session, store, savePlace, removePlace } = useAdmin()
  const navigate = useNavigate()
  const original = store.places.find((p) => p.id === placeId)
  const [place, setPlace] = useState<Place | null>(() =>
    original ? structuredClone(original) : null,
  )
  const [tab, setTab] = useState<'basics' | 'access' | 'photos' | 'safety'>(
    'basics',
  )
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [autosaveState, setAutosaveState] = useState<
    'idle' | 'pending' | 'saved' | 'error'
  >('idle')
  const skipAutosave = useRef(true)
  const placeRef = useRef(place)
  placeRef.current = place

  useEffect(() => {
    const next = store.places.find((p) => p.id === placeId)
    if (next) {
      skipAutosave.current = true
      setPlace(structuredClone(next))
    }
  }, [store.places, placeId])

  const mode = useMemo(() => {
    if (!session || !place) return 'readonly' as Mode
    return modeFor(session.roleKey, place, session.memberId)
  }, [session, place])

  const progress = useMemo(
    () => (place ? daRequiredProgress(place) : null),
    [place],
  )

  // Autosave drafts for DA (and CEO editing drafts)
  useEffect(() => {
    if (!place || !session) return
    if (mode !== 'da' && !(mode === 'ceo' && place.status === 'draft')) return
    if (place.status !== 'draft' && mode === 'da') return
    if (skipAutosave.current) {
      skipAutosave.current = false
      return
    }
    setAutosaveState('pending')
    const timer = window.setTimeout(() => {
      const snapshot = placeRef.current
      if (!snapshot) return
      void savePlace(
        {
          ...snapshot,
          photos: sortPhotosCoverFirst(snapshot.photos),
          updatedAt: new Date().toISOString(),
        },
        { withSafety: false },
      )
        .then(() => setAutosaveState('saved'))
        .catch(() => setAutosaveState('error'))
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [place, mode, session, savePlace])

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

  async function save(
    extra?: Partial<Place>,
    activitySummary?: string,
    withSafety = false,
  ) {
    if (!place || !session) return
    setBusy(true)
    setMsg(null)
    try {
      let next: Place = {
        ...place,
        ...extra,
        photos: sortPhotosCoverFirst((extra?.photos ?? place.photos)),
        updatedAt: new Date().toISOString(),
      }

      if (
        place.status === 'published' &&
        (mode === 'da' || mode === 'ceo') &&
        !extra?.status
      ) {
        next = { ...next, status: 'awaiting_safety' }
        setMsg('Published place edited — returned to Awaiting safety.')
      }

      await savePlace(next, {
        withSafety: withSafety || mode === 'safety' || mode === 'ceo',
        activity: activitySummary
          ? { action: 'place.saved', summary: activitySummary }
          : undefined,
      })
      skipAutosave.current = true
      setPlace(next)
      if (!msg) setMsg('Saved to Supabase.')
      setAutosaveState('saved')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  async function submitSafety() {
    if (!place) return
    const err = daCanSubmit(place)
    if (err) {
      setMsg(err)
      return
    }
    setBusy(true)
    setMsg(null)
    try {
      const next: Place = {
        ...place,
        status: 'awaiting_safety',
        photos: sortPhotosCoverFirst(place.photos),
        updatedAt: new Date().toISOString(),
      }
      await savePlace(next, {
        activity: {
          action: 'place.submitted',
          summary: `Submitted ${place.nameEn || 'place'} for safety`,
        },
      })
      skipAutosave.current = true
      setPlace(next)
      setMsg('Submitted → Awaiting safety.')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Submit failed')
    } finally {
      setBusy(false)
    }
  }

  async function markReady() {
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
    setBusy(true)
    try {
      await savePlace(next, {
        withSafety: true,
        activity: {
          action: 'safety.ready',
          summary: `Marked ${next.nameEn} Ready`,
        },
      })
      skipAutosave.current = true
      setPlace(next)
      setMsg('Marked Ready.')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Failed')
    } finally {
      setBusy(false)
    }
  }

  async function publish() {
    if (!place) return
    if (place.status !== 'ready') {
      setMsg('Only Ready places can be published.')
      return
    }
    const err = safetyComplete(place)
    if (err) {
      setMsg(err)
      setTab('safety')
      return
    }
    setBusy(true)
    try {
      const next: Place = {
        ...place,
        status: 'published',
        updatedAt: new Date().toISOString(),
      }
      await savePlace(next, {
        withSafety: true,
        activity: {
          action: 'place.published',
          summary: `Published ${place.nameEn}`,
        },
      })
      skipAutosave.current = true
      setPlace(next)
      setMsg('Published.')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Publish failed')
    } finally {
      setBusy(false)
    }
  }

  async function sendBack(status: 'needs_changes' | 'rejected') {
    if (!place) return
    await save(
      { status },
      `Set ${place.nameEn} to ${status.replace('_', ' ')}`,
      true,
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
        captionEn: '',
        captionAr: '',
      }))
    patch({ photos: sortPhotosCoverFirst([...existing, ...added]) })
  }

  function setCover(id: string) {
    if (!place) return
    patch({
      photos: sortPhotosCoverFirst(
        place.photos.map((p) => ({ ...p, isCover: p.id === id })),
      ),
    })
  }

  function removePhoto(id: string) {
    if (!place) return
    let photos = place.photos.filter((p) => p.id !== id)
    if (photos.length && !photos.some((p) => p.isCover)) {
      photos = [{ ...photos[0], isCover: true }, ...photos.slice(1)]
    }
    patch({ photos: sortPhotosCoverFirst(photos) })
  }

  function patchPhoto(id: string, partial: Partial<PlacePhoto>) {
    if (!place) return
    patch({
      photos: place.photos.map((p) =>
        p.id === id ? { ...p, ...partial } : p,
      ),
    })
  }

  async function onDelete() {
    if (!place || !session) return
    if (!confirm('Delete this place?')) return
    const can =
      mode === 'ceo' ||
      (mode === 'da' && place.createdBy === session.memberId)
    if (!can) return
    setBusy(true)
    try {
      await removePlace(place.id, {
        action: 'place.deleted',
        summary: `Deleted ${place.nameEn || place.id}`,
      })
      navigate(backTo)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Delete failed')
      setBusy(false)
    }
  }

  const tabs: { id: typeof tab; label: string }[] = [
    { id: 'basics', label: 'Basics' },
    { id: 'access', label: 'Access' },
    { id: 'photos', label: 'Photos' },
  ]
  if (showSafetyTab) tabs.push({ id: 'safety', label: 'Safety' })

  const autosaveLabel =
    autosaveState === 'pending'
      ? 'Autosaving…'
      : autosaveState === 'saved'
        ? 'Draft autosaved'
        : autosaveState === 'error'
          ? 'Autosave failed'
          : null

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
            {autosaveLabel ? ` · ${autosaveLabel}` : ''}
          </p>
        </div>
        <div className="admin-actions" style={{ marginTop: 0 }}>
          {daEditable && (
            <button
              type="button"
              className="admin-btn secondary"
              disabled={busy}
              onClick={() =>
                void save(undefined, `Saved ${place.nameEn || 'place'}`)
              }
            >
              Save
            </button>
          )}
          {mode === 'safety' && (
            <button
              type="button"
              className="admin-btn secondary"
              disabled={busy}
              onClick={() =>
                void save(undefined, `Updated safety for ${place.nameEn}`, true)
              }
            >
              Save safety
            </button>
          )}
          {mode === 'da' && place.status === 'draft' && (
            <button
              type="button"
              className="admin-btn"
              disabled={busy}
              onClick={() => void submitSafety()}
            >
              Submit for safety
            </button>
          )}
          {(mode === 'safety' || mode === 'ceo') &&
            (place.status === 'awaiting_safety' ||
              place.status === 'needs_changes') && (
              <>
                <button
                  type="button"
                  className="admin-btn"
                  disabled={busy}
                  onClick={() => void markReady()}
                >
                  Mark Ready
                </button>
                <button
                  type="button"
                  className="admin-btn sand"
                  disabled={busy}
                  onClick={() => void sendBack('needs_changes')}
                >
                  Needs changes
                </button>
                <button
                  type="button"
                  className="admin-btn danger"
                  disabled={busy}
                  onClick={() => void sendBack('rejected')}
                >
                  Reject
                </button>
              </>
            )}
          {mode === 'ceo' && place.status === 'ready' && (
            <button
              type="button"
              className="admin-btn"
              disabled={busy}
              onClick={() => void publish()}
            >
              Publish
            </button>
          )}
          {(mode === 'ceo' || mode === 'da') && (
            <button
              type="button"
              className="admin-btn danger"
              disabled={busy}
              onClick={() => void onDelete()}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {mode === 'da' && progress && (
        <div className="admin-panel" style={{ marginBottom: '0.85rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '0.45rem',
            }}
          >
            <strong style={{ fontSize: '0.92rem' }}>
              Required fields · {progress.done}/{progress.total}
            </strong>
            <span className="admin-muted">{progress.percent}%</span>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 999,
              background: '#e2ebe5',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress.percent}%`,
                height: '100%',
                background: progress.percent === 100 ? '#1F8A7A' : '#E6C989',
              }}
            />
          </div>
          {progress.missing.length > 0 && (
            <p className="admin-muted" style={{ margin: '0.55rem 0 0' }}>
              Still needed: {progress.missing.join(' · ')}
            </p>
          )}
        </div>
      )}

      {mode === 'readonly' && (
        <div className="admin-banner">
          View only — owned by {place.ownerLabel}. Fields are read-only (no
          edits).
        </div>
      )}
      {mode === 'safety' && (
        <div className="admin-banner info">
          DA fields are read-only. Complete Safety dropdowns + emergency
          contacts, then pick nearest clinic on the OSM map before Mark Ready.
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
            <div className="admin-field">
              <label>Difficulty</label>
              <select
                value={place.difficulty}
                disabled={!daEditable}
                onChange={(e) => patch({ difficulty: e.target.value })}
              >
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Season from</label>
              <select
                value={place.seasonFrom ?? ''}
                disabled={!daEditable}
                onChange={(e) =>
                  patch({
                    seasonFrom: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              >
                <option value="">Select month</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.en} · {m.ar}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Season to</label>
              <select
                value={place.seasonTo ?? ''}
                disabled={!daEditable}
                onChange={(e) =>
                  patch({
                    seasonTo: e.target.value ? Number(e.target.value) : null,
                  })
                }
              >
                <option value="">Select month</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.en} · {m.ar}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="Hike length (km)"
              value={place.distanceKm}
              disabled={!daEditable}
              onChange={(v) => patch({ distanceKm: v })}
            />
            <Field
              label="Estimated time"
              value={place.durationText}
              disabled={!daEditable}
              onChange={(v) => patch({ durationText: v })}
            />
            <Field
              label="Start place (EN)"
              value={place.startPlaceEn}
              disabled={!daEditable}
              onChange={(v) => patch({ startPlaceEn: v })}
            />
            <Field
              label="نقطة البداية (AR)"
              value={place.startPlaceAr}
              disabled={!daEditable}
              dir="rtl"
              onChange={(v) => patch({ startPlaceAr: v })}
            />
            <Field
              label="End place (EN)"
              value={place.endPlaceEn}
              disabled={!daEditable}
              onChange={(v) => patch({ endPlaceEn: v })}
            />
            <Field
              label="نقطة النهاية (AR)"
              value={place.endPlaceAr}
              disabled={!daEditable}
              dir="rtl"
              onChange={(v) => patch({ endPlaceAr: v })}
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
            <div className="admin-field full">
              <label>Nearby amenities (OpenStreetMap)</label>
              <p className="admin-muted" style={{ margin: '0 0 0.65rem' }}>
                Search and pick coffee shops / services on the free OSM map
                (same pattern as Safety clinic). Each item stores name, place
                id, lat/lng, and maps URL. Bilingual notes below are optional
                extras.
              </p>
              {place.nearbyAmenities.map((am, idx) => (
                <AmenityMapPicker
                  key={am.id}
                  value={am}
                  disabled={!daEditable}
                  kindOptions={AMENITY_KINDS}
                  onChange={(next) => {
                    const list = [...place.nearbyAmenities]
                    list[idx] = next
                    patch({ nearbyAmenities: list })
                  }}
                  onRemove={
                    daEditable
                      ? () =>
                          patch({
                            nearbyAmenities: place.nearbyAmenities.filter(
                              (a) => a.id !== am.id,
                            ),
                          })
                      : undefined
                  }
                />
              ))}
              {daEditable && (
                <button
                  type="button"
                  className="admin-btn secondary"
                  style={{ marginBottom: '0.85rem' }}
                  onClick={() =>
                    patch({
                      nearbyAmenities: [
                        ...place.nearbyAmenities,
                        {
                          id: crypto.randomUUID(),
                          kind: 'cafe',
                          nameEn: '',
                          nameAr: '',
                          placeId: '',
                          lat: null,
                          lng: null,
                          mapsUrl: '',
                        },
                      ],
                    })
                  }
                >
                  Add amenity
                </button>
              )}
            </div>
            <Field
              label="Amenities notes (EN)"
              value={place.amenitiesNotesEn}
              disabled={!daEditable}
              textarea
              className="full"
              onChange={(v) => patch({ amenitiesNotesEn: v })}
            />
            <Field
              label="ملاحظات الخدمات القريبة (AR)"
              value={place.amenitiesNotesAr}
              disabled={!daEditable}
              textarea
              dir="rtl"
              className="full"
              onChange={(v) => patch({ amenitiesNotesAr: v })}
            />
          </div>
        )}

        {tab === 'photos' && (
          <div>
            <p className="admin-muted" style={{ marginBottom: '0.75rem' }}>
              2–10 photos, one cover (shown first). Each photo needs EN + AR
              captions. Storage upload later — metadata saved on the place.
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
              {sortPhotosCoverFirst(place.photos).map((ph) => (
                <div key={ph.id} className="admin-photo">
                  <img src={ph.url} alt={ph.captionEn || 'Place photo'} />
                  <div className="meta">
                    {ph.isCover ? (
                      <strong>Cover (first)</strong>
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
                  <div style={{ padding: '0.45rem 0.5rem 0.6rem' }}>
                    <input
                      placeholder="Caption EN"
                      value={ph.captionEn ?? ''}
                      disabled={!daEditable}
                      onChange={(e) =>
                        patchPhoto(ph.id, { captionEn: e.target.value })
                      }
                      style={{
                        width: '100%',
                        marginBottom: 4,
                        border: '1px solid #d5e0d9',
                        borderRadius: 6,
                        padding: '0.3rem 0.4rem',
                        fontSize: '0.78rem',
                      }}
                    />
                    <input
                      placeholder="التعليق AR"
                      dir="rtl"
                      value={ph.captionAr ?? ''}
                      disabled={!daEditable}
                      onChange={(e) =>
                        patchPhoto(ph.id, { captionAr: e.target.value })
                      }
                      style={{
                        width: '100%',
                        border: '1px solid #d5e0d9',
                        borderRadius: 6,
                        padding: '0.3rem 0.4rem',
                        fontSize: '0.78rem',
                      }}
                    />
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
                ['whenNotToGo', 'When not to go'],
                ['kit', 'Kit'],
              ] as const
            ).map(([key, label]) => (
              <div className="admin-field" key={key}>
                <label>{label}</label>
                <select
                  value={place.safety[key]}
                  disabled={!safetyEditable}
                  onChange={(e) => patchSafety({ [key]: e.target.value })}
                >
                  <option value="">Select…</option>
                  {SAFETY_DROPDOWNS[key].map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <Field
              label="Emergency contacts (required)"
              value={place.safety.emergencyContacts}
              disabled={!safetyEditable}
              textarea
              className="full"
              onChange={(v) => patchSafety({ emergencyContacts: v })}
            />
            <ClinicMapPicker
              disabled={!safetyEditable}
              value={{
                nearestClinic: place.safety.nearestClinic,
                nearestClinicPlaceId: place.safety.nearestClinicPlaceId,
                nearestClinicLat: place.safety.nearestClinicLat,
                nearestClinicLng: place.safety.nearestClinicLng,
                nearestClinicMapsUrl: place.safety.nearestClinicMapsUrl,
              }}
              onChange={(clinic) => patchSafety(clinic)}
            />
            <Field
              label="Extra notes (EN)"
              value={place.safety.notesEn}
              disabled={!safetyEditable}
              textarea
              className="full"
              onChange={(v) => patchSafety({ notesEn: v })}
            />
            <Field
              label="ملاحظات إضافية (AR)"
              value={place.safety.notesAr}
              disabled={!safetyEditable}
              textarea
              dir="rtl"
              className="full"
              onChange={(v) => patchSafety({ notesAr: v })}
            />
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
