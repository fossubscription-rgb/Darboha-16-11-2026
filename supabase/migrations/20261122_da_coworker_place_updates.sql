-- Allow any Data Analyst to UPDATE places owned by coworkers (not only own).
-- Keep DELETE as owner-or-CEO. Lock created_by so edits cannot reassign ownership.
-- Applied on Supabase project ousnkaapifihaphktbxu as v1_da_coworker_place_updates.

DROP POLICY IF EXISTS places_update_owner_or_ceo ON public.places;

CREATE POLICY places_update_da_or_ceo_or_safety
  ON public.places
  FOR UPDATE
  USING (
    private.current_admin_role_key() = 'ceo'
    OR private.is_admin_role(ARRAY['da1'::text, 'da2'::text])
    OR private.current_admin_role_key() = 'safety'
  )
  WITH CHECK (
    private.current_admin_role_key() = 'ceo'
    OR private.is_admin_role(ARRAY['da1'::text, 'da2'::text])
    OR private.current_admin_role_key() = 'safety'
  );

CREATE OR REPLACE FUNCTION private.places_lock_created_by()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'private'
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW.created_by IS DISTINCT FROM OLD.created_by
     AND private.current_admin_role_key() IS DISTINCT FROM 'ceo' THEN
    RAISE EXCEPTION 'cannot reassign place ownership';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS places_lock_created_by ON public.places;

CREATE TRIGGER places_lock_created_by
  BEFORE UPDATE ON public.places
  FOR EACH ROW
  EXECUTE FUNCTION private.places_lock_created_by();
