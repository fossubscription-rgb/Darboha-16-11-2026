import { useAdminLocale } from '../AdminLocale'
import type { PlaceAmenity } from '../types'
import { OsmPlacePicker } from './OsmPlacePicker'

type Props = {
  value: PlaceAmenity
  disabled?: boolean
  onChange: (next: PlaceAmenity) => void
  onRemove?: () => void
  kindOptions: { value: PlaceAmenity['kind']; label: string }[]
}

export function AmenityMapPicker({
  value,
  disabled,
  onChange,
  onRemove,
  kindOptions,
}: Props) {
  const { t } = useAdminLocale()
  return (
    <div
      style={{
        marginBottom: '0.85rem',
        paddingBottom: '0.85rem',
        borderBottom: '1px solid #e2ebe5',
      }}
    >
      <div className="admin-form-grid" style={{ marginBottom: '0.45rem' }}>
        <div className="admin-field">
          <label>{t.map.kind}</label>
          <select
            value={value.kind}
            disabled={disabled}
            onChange={(e) =>
              onChange({
                ...value,
                kind: e.target.value as PlaceAmenity['kind'],
              })
            }
          >
            {kindOptions.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-field">
          <label>&nbsp;</label>
          {!disabled && onRemove ? (
            <button
              type="button"
              className="admin-btn danger"
              style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
              onClick={onRemove}
            >
              {t.common.remove}
            </button>
          ) : null}
        </div>
      </div>

      <OsmPlacePicker
        label={t.map.nearbyPlace}
        hint={t.map.nearbyHint}
        searchPlaceholder={t.map.nearbySearch}
        disabled={disabled}
        mapHeight={200}
        value={{
          name: value.nameEn,
          placeId: value.placeId,
          lat: value.lat,
          lng: value.lng,
          mapsUrl: value.mapsUrl,
        }}
        onChange={(next) =>
          onChange({
            ...value,
            nameEn: next.name,
            nameAr: value.nameAr || next.name,
            placeId: next.placeId,
            lat: next.lat,
            lng: next.lng,
            mapsUrl: next.mapsUrl,
          })
        }
      />

      <div className="admin-form-grid" style={{ marginTop: '0.35rem' }}>
        <div className="admin-field">
          <label>{t.editor.nameEn}</label>
          <input
            value={value.nameEn}
            disabled={disabled}
            onChange={(e) => onChange({ ...value, nameEn: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>{t.editor.nameAr}</label>
          <input
            dir="rtl"
            value={value.nameAr}
            disabled={disabled}
            onChange={(e) => onChange({ ...value, nameAr: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
