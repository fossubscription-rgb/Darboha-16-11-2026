import { OsmPlacePicker } from './OsmPlacePicker'
import type { PlaceAmenity } from '../types'

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
          <label>Kind</label>
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
              Remove
            </button>
          ) : null}
        </div>
      </div>

      <OsmPlacePicker
        label="Nearby place (OpenStreetMap)"
        hint="Search cafes / shops / services, or click the map. Stores name, place id, lat/lng, maps URL."
        searchPlaceholder="Search coffee shops / amenities in Oman…"
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
          <label>Name (EN)</label>
          <input
            value={value.nameEn}
            disabled={disabled}
            onChange={(e) => onChange({ ...value, nameEn: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>الاسم (AR)</label>
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
