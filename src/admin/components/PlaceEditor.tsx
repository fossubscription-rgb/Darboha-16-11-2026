import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAdmin } from '../AdminContext'
import { useAdminLocale } from '../AdminLocale'
import {
  daCanSubmit,
  daRequiredProgress,
  safetyComplete,
  sortPhotosCoverFirst,
} from '../store'
import {
  DIFFICULTY_OPTIONS,
  isDataAnalystRole,
  MONTHS,
  SAFETY_DROPDOWNS,
} from '../constants'
import type { AdminCopy } from '../i18n'
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
import { TrailEndpointMapPicker } from './TrailEndpointMapPicker'

type Mode = 'da' | 'safety' | 'ceo' | 'readonly'

function reqLabel(t: AdminCopy, key: string) {
  return (t.req as Record<string, string>)[key] ?? key
}

function safetyFieldLabel(t: AdminCopy, field: string) {
  const map: Record<string, string> = {
    hazards: t.editor.hazards,
    heat: t.editor.heat,
    flood: t.editor.flood,
    water: t.editor.water,
    signal: t.editor.signal,
    whenNotToGo: t.editor.whenNotToGo,
    kit: t.editor.kit,
  }
  return map[field] ?? field
}

const WHEN_OPT_KEYS: Record<string, string> = {
  rain_flood: 'when_rain_flood',
  midday_heat: 'when_midday_heat',
  night: 'when_night',
  crowds: 'when_crowds',
  high_wind: 'when_high_wind',
  other: 'when_other',
}

function safetyOptLabel(
  t: AdminCopy,
  dropdown: keyof typeof SAFETY_DROPDOWNS,
  value: string,
  fallback: string,
) {
  const key =
    dropdown === 'whenNotToGo'
      ? (WHEN_OPT_KEYS[value] ?? `when_${value}`)
      : `${dropdown}_${value}`
  return (t.safetyOpts as Record<string, string>)[key] ?? fallback
}

function modeFor(role: RoleKey, _place: Place, _memberId: string): Mode {
  if (role === 'safety') return 'safety'
  if (role === 'ceo') return 'ceo'
  if (role === 'cfo') return 'readonly'
  // DAs may edit coworkers' places; ownership stays on created_by.
  if (isDataAnalystRole(role)) return 'da'
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
  const { t, format } = useAdminLocale()
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

  const vehicleOptions: { value: VehicleAccess; label: string }[] = [
    { value: 'two_wd', label: t.vehicle.two_wd },
    { value: 'four_wd', label: t.vehicle.four_wd },
    { value: 'four_x4_recommended', label: t.vehicle.four_x4_recommended },
    { value: 'other', label: t.vehicle.other },
  ]

  const amenityKinds: { value: PlaceAmenity['kind']; label: string }[] = [
    { value: 'cafe', label: t.amenityKind.cafe },
    { value: 'shop', label: t.amenityKind.shop },
    { value: 'restroom', label: t.amenityKind.restroom },
    { value: 'water', label: t.amenityKind.water },
    { value: 'parking', label: t.amenityKind.parking },
    { value: 'other', label: t.amenityKind.other },
  ]

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
        <p>{t.editor.placeNotFound}</p>
        <Link to={backTo}>{t.common.back}</Link>
      </div>
    )
  }

  const daEditable = mode === 'da' || mode === 'ceo'
  const safetyEditable = mode === 'safety' || mode === 'ceo'
  const showSafetyTab = mode !== 'da'
  const isOwnPlace = place.createdBy === session.memberId
  const editingCoworkerPlace =
    mode === 'da' && isDataAnalystRole(session.roleKey) && !isOwnPlace
  const canDeletePlace =
    mode === 'ceo' || (mode === 'da' && isOwnPlace)

  function patch(partial: Partial<Place>) {
    // Never reassign ownership via local edits — created_by / owner stay put.
    const { createdBy: _cb, ownerLabel: _ol, ownerRoleKey: _ork, ...safe } =
      partial
    setPlace((p) => (p ? { ...p, ...safe } : p))
  }

  function patchSafety(partial: Partial<Place['safety']>) {
    setPlace((p) =>
      p ? { ...p, safety: { ...p.safety, ...partial } } : p,
    )
  }

  function blockerMessage(
    blocker: NonNullable<ReturnType<typeof safetyComplete>>,
  ) {
    if (blocker.code === 'choose') {
      return format(t.editor.safetyChoose, {
        field: safetyFieldLabel(t, blocker.field),
      })
    }
    if (blocker.code === 'emergency') return t.editor.safetyEmergency
    return t.editor.safetyClinic
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
        // Preserve original ownership even if extra tried to change it.
        createdBy: place.createdBy,
        ownerLabel: place.ownerLabel,
        ownerRoleKey: place.ownerRoleKey,
        photos: sortPhotosCoverFirst((extra?.photos ?? place.photos)),
        updatedAt: new Date().toISOString(),
      }

      if (
        place.status === 'published' &&
        (mode === 'da' || mode === 'ceo') &&
        !extra?.status
      ) {
        next = { ...next, status: 'awaiting_safety' }
        setMsg(t.editor.publishedEdited)
      }

      await savePlace(next, {
        withSafety: withSafety || mode === 'safety' || mode === 'ceo',
        activity: activitySummary
          ? { action: 'place.saved', summary: activitySummary }
          : undefined,
      })
      skipAutosave.current = true
      setPlace(next)
      if (!msg) setMsg(t.common.savedSupabase)
      setAutosaveState('saved')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t.common.saveFailed)
    } finally {
      setBusy(false)
    }
  }

  async function submitSafety() {
    if (!place) return
    const keys = daCanSubmit(place)
    if (keys) {
      setMsg(
        format(t.editor.stillNeededList, {
          list:
            keys
              .slice(0, 4)
              .map((k) => reqLabel(t, k))
              .join(', ') + (keys.length > 4 ? '…' : ''),
        }),
      )
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
      setMsg(t.editor.submittedAwaiting)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : t.common.submitFailed)
    } finally {
      setBusy(false)
    }
  }

  async function markReady() {
    if (!place || !session) return
    const blocker = safetyComplete(place)
    if (blocker) {
      setMsg(blockerMessage(blocker))
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
      setMsg(t.editor.markedReady)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : t.editor.failed)
    } finally {
      setBusy(false)
    }
  }

  async function publish() {
    if (!place) return
    if (place.status !== 'ready') {
      setMsg(t.editor.onlyReadyPublish)
      return
    }
    const blocker = safetyComplete(place)
    if (blocker) {
      setMsg(blockerMessage(blocker))
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
      setMsg(t.editor.published)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : t.common.publishFailed)
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
      setMsg(t.editor.maxPhotos)
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
    if (!confirm(t.editor.confirmDelete)) return
    if (!canDeletePlace) return
    setBusy(true)
    try {
      await removePlace(place.id, {
        action: 'place.deleted',
        summary: `Deleted ${place.nameEn || place.id}`,
      })
      navigate(backTo)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : t.common.deleteFailed)
      setBusy(false)
    }
  }

  const tabs: { id: typeof tab; label: string }[] = [
    { id: 'basics', label: t.editor.tabBasics },
    { id: 'access', label: t.editor.tabAccess },
    { id: 'photos', label: t.editor.tabPhotos },
  ]
  if (showSafetyTab) tabs.push({ id: 'safety', label: t.editor.tabSafety })

  const autosaveLabel =
    autosaveState === 'pending'
      ? t.editor.autosaving
      : autosaveState === 'saved'
        ? t.editor.autosaved
        : autosaveState === 'error'
          ? t.editor.autosaveFailed
          : null

  const safetyFields = [
    ['hazards', t.editor.hazards],
    ['heat', t.editor.heat],
    ['flood', t.editor.flood],
    ['water', t.editor.water],
    ['signal', t.editor.signal],
    ['whenNotToGo', t.editor.whenNotToGo],
    ['kit', t.editor.kit],
  ] as const

  return (
    <div>
      <div className="admin-crumb">
        <Link to={backTo}>{t.common.places}</Link> /{' '}
        {place.nameEn || t.common.untitled}
      </div>
      <div className="admin-page-head">
        <div>
          <h1>{place.nameEn || t.common.untitledPlace}</h1>
          <p>
            <StatusChip status={place.status} />{' '}
            <span
              className="admin-owner-pill"
              title={t.editor.whoseWorkTitle}
            >
              {t.editor.whoseWork} {place.ownerLabel}
            </span>
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
              {t.common.save}
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
              {t.editor.saveSafety}
            </button>
          )}
          {mode === 'da' && place.status === 'draft' && (
            <button
              type="button"
              className="admin-btn"
              disabled={busy}
              onClick={() => void submitSafety()}
            >
              {t.editor.submitSafety}
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
                  {t.editor.markReady}
                </button>
                <button
                  type="button"
                  className="admin-btn sand"
                  disabled={busy}
                  onClick={() => void sendBack('needs_changes')}
                >
                  {t.editor.needsChanges}
                </button>
                <button
                  type="button"
                  className="admin-btn danger"
                  disabled={busy}
                  onClick={() => void sendBack('rejected')}
                >
                  {t.editor.reject}
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
              {t.editor.publish}
            </button>
          )}
          {canDeletePlace && (
            <button
              type="button"
              className="admin-btn danger"
              disabled={busy}
              onClick={() => void onDelete()}
            >
              {t.common.delete}
            </button>
          )}
        </div>
      </div>

      {editingCoworkerPlace && (
        <div className="admin-banner info">
          {format(t.editor.coworkerBanner, { owner: place.ownerLabel })}
        </div>
      )}

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
              {format(t.editor.requiredFields, {
                done: progress.done,
                total: progress.total,
              })}
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
              {format(t.editor.stillNeededList, {
                list: progress.missing.map((k) => reqLabel(t, k)).join(' · '),
              })}
            </p>
          )}
        </div>
      )}

      {mode === 'readonly' && (
        <div className="admin-banner">
          {format(t.editor.readonlyBanner, { owner: place.ownerLabel })}
        </div>
      )}
      {mode === 'safety' && (
        <div className="admin-banner info">{t.editor.safetyBanner}</div>
      )}
      {msg && <div className="admin-banner info">{msg}</div>}

      <div className="admin-panel">
        <div className="admin-tabs" role="tablist">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.id}
              type="button"
              className={tab === tabItem.id ? 'active' : undefined}
              onClick={() => setTab(tabItem.id)}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        {tab === 'basics' && (
          <div className="admin-form-grid">
            <Field
              label={t.editor.nameEn}
              value={place.nameEn}
              disabled={!daEditable}
              onChange={(v) => patch({ nameEn: v })}
            />
            <Field
              label={t.editor.nameAr}
              value={place.nameAr}
              disabled={!daEditable}
              dir="rtl"
              onChange={(v) => patch({ nameAr: v })}
            />
            <Field
              label={t.editor.summaryEn}
              value={place.summaryEn}
              disabled={!daEditable}
              textarea
              className="full"
              onChange={(v) => patch({ summaryEn: v })}
            />
            <Field
              label={t.editor.summaryAr}
              value={place.summaryAr}
              disabled={!daEditable}
              textarea
              dir="rtl"
              className="full"
              onChange={(v) => patch({ summaryAr: v })}
            />
            <Field
              label={t.editor.region}
              value={place.region}
              disabled={!daEditable}
              onChange={(v) => patch({ region: v })}
            />
            <div className="admin-field">
              <label>{t.editor.difficulty}</label>
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
              <label>{t.editor.seasonFrom}</label>
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
                <option value="">{t.common.selectMonth}</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.en} · {m.ar}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>{t.editor.seasonTo}</label>
              <select
                value={place.seasonTo ?? ''}
                disabled={!daEditable}
                onChange={(e) =>
                  patch({
                    seasonTo: e.target.value ? Number(e.target.value) : null,
                  })
                }
              >
                <option value="">{t.common.selectMonth}</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.en} · {m.ar}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label={t.editor.hikeLength}
              value={place.distanceKm}
              disabled={!daEditable}
              onChange={(v) => patch({ distanceKm: v })}
            />
            <Field
              label={t.editor.estimatedTime}
              value={place.durationText}
              disabled={!daEditable}
              onChange={(v) => patch({ durationText: v })}
            />
            <TrailEndpointMapPicker
              labelEn={t.editor.startPlace}
              labelAr={t.editor.startPlaceAr}
              disabled={!daEditable}
              value={{
                nameEn: place.startPlaceEn,
                nameAr: place.startPlaceAr,
                placeId: place.startPlacePlaceId,
                lat: place.startPlaceLat,
                lng: place.startPlaceLng,
                mapsUrl: place.startPlaceMapsUrl,
              }}
              onChange={(next) =>
                patch({
                  startPlaceEn: next.nameEn,
                  startPlaceAr: next.nameAr,
                  startPlacePlaceId: next.placeId,
                  startPlaceLat: next.lat,
                  startPlaceLng: next.lng,
                  startPlaceMapsUrl: next.mapsUrl,
                })
              }
            />
            <TrailEndpointMapPicker
              labelEn={t.editor.endPlace}
              labelAr={t.editor.endPlaceAr}
              disabled={!daEditable}
              value={{
                nameEn: place.endPlaceEn,
                nameAr: place.endPlaceAr,
                placeId: place.endPlacePlaceId,
                lat: place.endPlaceLat,
                lng: place.endPlaceLng,
                mapsUrl: place.endPlaceMapsUrl,
              }}
              onChange={(next) =>
                patch({
                  endPlaceEn: next.nameEn,
                  endPlaceAr: next.nameAr,
                  endPlacePlaceId: next.placeId,
                  endPlaceLat: next.lat,
                  endPlaceLng: next.lng,
                  endPlaceMapsUrl: next.mapsUrl,
                })
              }
            />
            <div className="admin-field full">
              <label>
                <input
                  type="checkbox"
                  checked={place.fragile}
                  disabled={!daEditable}
                  onChange={(e) => patch({ fragile: e.target.checked })}
                />{' '}
                {t.editor.fragile}
              </label>
            </div>
          </div>
        )}

        {tab === 'access' && (
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>{t.editor.vehicleAccess}</label>
              <select
                value={place.vehicleAccess}
                disabled={!daEditable}
                onChange={(e) =>
                  patch({ vehicleAccess: e.target.value as VehicleAccess })
                }
              >
                {vehicleOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div />
            <Field
              label={t.editor.accessNotesEn}
              value={place.accessNotesEn}
              disabled={!daEditable}
              textarea
              className="full"
              onChange={(v) => patch({ accessNotesEn: v })}
            />
            <Field
              label={t.editor.accessNotesAr}
              value={place.accessNotesAr}
              disabled={!daEditable}
              textarea
              dir="rtl"
              className="full"
              onChange={(v) => patch({ accessNotesAr: v })}
            />
            <Field
              label={t.editor.trailheadEn}
              value={place.trailheadNotesEn}
              disabled={!daEditable}
              textarea
              className="full"
              onChange={(v) => patch({ trailheadNotesEn: v })}
            />
            <Field
              label={t.editor.trailheadAr}
              value={place.trailheadNotesAr}
              disabled={!daEditable}
              textarea
              dir="rtl"
              className="full"
              onChange={(v) => patch({ trailheadNotesAr: v })}
            />
            <div className="admin-field full">
              <label>{t.editor.amenitiesTitle}</label>
              <p className="admin-muted" style={{ margin: '0 0 0.65rem' }}>
                {t.editor.amenitiesHint}
              </p>
              {place.nearbyAmenities.map((am, idx) => (
                <AmenityMapPicker
                  key={am.id}
                  value={am}
                  disabled={!daEditable}
                  kindOptions={amenityKinds}
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
                  {t.editor.addAmenity}
                </button>
              )}
            </div>
            <Field
              label={t.editor.amenitiesNotesEn}
              value={place.amenitiesNotesEn}
              disabled={!daEditable}
              textarea
              className="full"
              onChange={(v) => patch({ amenitiesNotesEn: v })}
            />
            <Field
              label={t.editor.amenitiesNotesAr}
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
              {t.editor.photosHint}
            </p>
            {daEditable && (
              <div className="admin-actions" style={{ marginTop: 0 }}>
                <label className="admin-btn secondary" style={{ cursor: 'pointer' }}>
                  {t.editor.addPhotos}
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
                  <img
                    src={ph.url}
                    alt={ph.captionEn || t.editor.placePhotoAlt}
                  />
                  <div className="meta">
                    {ph.isCover ? (
                      <strong>{t.editor.coverFirst}</strong>
                    ) : daEditable ? (
                      <button
                        type="button"
                        className="admin-btn secondary"
                        style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem' }}
                        onClick={() => setCover(ph.id)}
                      >
                        {t.editor.setCover}
                      </button>
                    ) : (
                      <span>{t.editor.photo}</span>
                    )}
                    {daEditable && (
                      <button
                        type="button"
                        className="admin-btn danger"
                        style={{ padding: '0.25rem 0.45rem', fontSize: '0.72rem' }}
                        onClick={() => removePhoto(ph.id)}
                      >
                        {t.common.remove}
                      </button>
                    )}
                  </div>
                  <div style={{ padding: '0.45rem 0.5rem 0.6rem' }}>
                    <input
                      placeholder={t.editor.captionEn}
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
                      placeholder={t.editor.captionAr}
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
            {safetyFields.map(([key, label]) => (
              <div className="admin-field" key={key}>
                <label>{label}</label>
                <select
                  value={place.safety[key]}
                  disabled={!safetyEditable}
                  onChange={(e) => patchSafety({ [key]: e.target.value })}
                >
                  <option value="">{t.common.selectEllipsis}</option>
                  {SAFETY_DROPDOWNS[key].map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {safetyOptLabel(t, key, opt.value, opt.label)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <Field
              label={t.editor.emergencyContacts}
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
              label={t.editor.safetyNotesEn}
              value={place.safety.notesEn}
              disabled={!safetyEditable}
              textarea
              className="full"
              onChange={(v) => patchSafety({ notesEn: v })}
            />
            <Field
              label={t.editor.safetyNotesAr}
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
