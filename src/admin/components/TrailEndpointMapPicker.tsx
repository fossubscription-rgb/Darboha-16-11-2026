import { OsmPlacePicker } from './OsmPlacePicker'

export type TrailEndpointSelection = {
  nameEn: string
  nameAr: string
  placeId: string
  lat: number | null
  lng: number | null
  mapsUrl: string
}

type Props = {
  /** e.g. "Start place" / "نقطة البداية" */
  labelEn: string
  labelAr: string
  value: TrailEndpointSelection
  disabled?: boolean
  onChange: (next: TrailEndpointSelection) => void
}

/**
 * Leaflet + OSM/Nominatim picker for trail start/end.
 * Same stored shape as clinic/cafes: name(s), place id, coords, maps URL.
 */
export function TrailEndpointMapPicker({
  labelEn,
  labelAr,
  value,
  disabled,
  onChange,
}: Props) {
  return (
    <div
      className="admin-field full"
      style={{
        marginBottom: '0.85rem',
        paddingBottom: '0.85rem',
        borderBottom: '1px solid #e2ebe5',
      }}
    >
      <OsmPlacePicker
        label={`${labelEn} · ${labelAr} (OpenStreetMap)`}
        hint="Search or click the map. Stores name, place id, lat/lng, and maps URL — same pattern as clinic / nearby cafes."
        searchPlaceholder={`Search ${labelEn.toLowerCase()} in Oman…`}
        disabled={disabled}
        mapHeight={220}
        value={{
          name: value.nameEn || value.nameAr,
          placeId: value.placeId,
          lat: value.lat,
          lng: value.lng,
          mapsUrl: value.mapsUrl,
        }}
        onChange={(next) =>
          onChange({
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
          <label>{labelEn} (EN)</label>
          <input
            value={value.nameEn}
            disabled={disabled}
            onChange={(e) => onChange({ ...value, nameEn: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>{labelAr} (AR)</label>
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
