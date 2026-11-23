-- Start/end trail endpoints: OSM/Leaflet picker fields (same pattern as nearest_clinic).
-- Keep bilingual display names (start_place_en/ar, end_place_en/ar).

ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS start_place_place_id text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS start_place_lat double precision,
  ADD COLUMN IF NOT EXISTS start_place_lng double precision,
  ADD COLUMN IF NOT EXISTS start_place_maps_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS end_place_place_id text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS end_place_lat double precision,
  ADD COLUMN IF NOT EXISTS end_place_lng double precision,
  ADD COLUMN IF NOT EXISTS end_place_maps_url text NOT NULL DEFAULT '';

COMMENT ON COLUMN public.places.start_place_en IS 'Start place display name (EN); filled from OSM picker, editable.';
COMMENT ON COLUMN public.places.start_place_ar IS 'Start place display name (AR); filled from OSM picker, editable.';
COMMENT ON COLUMN public.places.end_place_en IS 'End place display name (EN); filled from OSM picker, editable.';
COMMENT ON COLUMN public.places.end_place_ar IS 'End place display name (AR); filled from OSM picker, editable.';
COMMENT ON COLUMN public.places.start_place_place_id IS 'OSM Nominatim place id ({osm_type}/{osm_id}) for trail start.';
COMMENT ON COLUMN public.places.start_place_lat IS 'Start place latitude from OSM picker.';
COMMENT ON COLUMN public.places.start_place_lng IS 'Start place longitude from OSM picker.';
COMMENT ON COLUMN public.places.start_place_maps_url IS 'OpenStreetMap URL for the selected start place.';
COMMENT ON COLUMN public.places.end_place_place_id IS 'OSM Nominatim place id ({osm_type}/{osm_id}) for trail end.';
COMMENT ON COLUMN public.places.end_place_lat IS 'End place latitude from OSM picker.';
COMMENT ON COLUMN public.places.end_place_lng IS 'End place longitude from OSM picker.';
COMMENT ON COLUMN public.places.end_place_maps_url IS 'OpenStreetMap URL for the selected end place.';
