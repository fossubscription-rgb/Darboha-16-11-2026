import { useAdminLocale } from '../AdminLocale'
import { OsmPlacePicker } from './OsmPlacePicker'

export type ClinicSelection = {
  nearestClinic: string
  nearestClinicPlaceId: string
  nearestClinicLat: number | null
  nearestClinicLng: number | null
  nearestClinicMapsUrl: string
}

type Props = {
  value: ClinicSelection
  disabled?: boolean
  onChange: (next: ClinicSelection) => void
}

export function ClinicMapPicker({ value, disabled, onChange }: Props) {
  const { t } = useAdminLocale()
  return (
    <OsmPlacePicker
      label={t.map.clinicLabel}
      hint={t.map.clinicHint}
      searchPlaceholder={t.map.clinicSearch}
      disabled={disabled}
      mapHeight={260}
      value={{
        name: value.nearestClinic,
        placeId: value.nearestClinicPlaceId,
        lat: value.nearestClinicLat,
        lng: value.nearestClinicLng,
        mapsUrl: value.nearestClinicMapsUrl,
      }}
      onChange={(next) =>
        onChange({
          nearestClinic: next.name,
          nearestClinicPlaceId: next.placeId,
          nearestClinicLat: next.lat,
          nearestClinicLng: next.lng,
          nearestClinicMapsUrl: next.mapsUrl,
        })
      }
    />
  )
}
