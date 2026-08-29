-- Fat Loss Coach V5.13
-- Profile-scoped daily-log uniqueness.
-- Multiple named profiles may share the same anonymous Supabase session,
-- so daily_logs must be unique per profile + date, not per auth user + date.

BEGIN;

-- Remove the old constraint that prevented two profiles from having a
-- daily log on the same date when they share the same auth.uid().
ALTER TABLE public.daily_logs
  DROP CONSTRAINT IF EXISTS daily_logs_user_id_log_date_key;

-- This is the identity used by the app's upsertDaily() call.
CREATE UNIQUE INDEX IF NOT EXISTS daily_logs_profile_id_log_date_key
  ON public.daily_logs (profile_id, log_date);

-- Keep password verification compatible with pgcrypto being installed in
-- the extensions schema. This replaces only the function; profile/data
-- rows are not modified by this migration.
CREATE OR REPLACE FUNCTION public.login_profile(
  p_profile_id uuid,
  p_password text
)
RETURNS public.app_profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
declare
  p public.app_profiles;
  hashed text;
begin
  if auth.uid() is null then
    raise exception 'No active app session';
  end if;

  select * into p
  from public.app_profiles
  where id = p_profile_id;

  if not found then
    raise exception 'Profile not found';
  end if;

  hashed := encode(
    extensions.digest(
      lower(coalesce(p_password, '')) || coalesce(p.password_salt, ''),
      'sha256'
    ),
    'hex'
  );

  if p.password_hash is null or hashed <> p.password_hash then
    raise exception 'Incorrect password';
  end if;

  -- Rebind this profile's records to the current anonymous app session.
  -- Because daily_logs is now unique by profile_id + log_date, this is safe
  -- even when another named profile has a log for the same date.
  update public.app_profiles
  set owner_id = auth.uid()
  where id = p.id;

  update public.daily_logs
  set user_id = auth.uid()
  where profile_id = p.id;

  update public.meals
  set user_id = auth.uid()
  where profile_id = p.id;

  update public.foods
  set user_id = auth.uid()
  where profile_id = p.id;

  update public.body_measurements
  set user_id = auth.uid()
  where profile_id = p.id;

  select * into p
  from public.app_profiles
  where id = p.id;

  return p;
end;
$function$;

COMMIT;
