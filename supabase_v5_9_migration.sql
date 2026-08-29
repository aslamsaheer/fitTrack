-- Fat Loss Coach V5.9
-- Password-protected named profiles without email authentication.
-- Run once in Supabase SQL Editor.

create extension if not exists pgcrypto;

alter table public.app_profiles
  add column if not exists password_salt text,
  add column if not exists password_hash text;

-- Legacy profiles created before V5.9 get a one-time default password equal to
-- their profile name. The user should change it after logging in.
update public.app_profiles
set password_salt = encode(gen_random_bytes(16), 'hex')
where password_salt is null;

update public.app_profiles
set password_hash = encode(digest(lower(name) || password_salt, 'sha256'), 'hex')
where password_hash is null;

-- Publicly expose ONLY the information needed to draw the login bubbles.
create or replace function public.list_login_profiles()
returns table (id uuid, name text, avatar text)
language sql
security definer
set search_path = public
as $$
  select p.id, p.name, p.avatar
  from public.app_profiles p
  order by p.created_at nulls first, p.name;
$$;

revoke all on function public.list_login_profiles() from public;
grant execute on function public.list_login_profiles() to anon, authenticated;

-- Verify password and re-bind the profile + its existing rows to the current
-- anonymous Supabase session. This lets a profile survive a browser/session reset.
create or replace function public.login_profile(p_profile_id uuid, p_password text)
returns public.app_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  p public.app_profiles;
  hashed text;
begin
  if auth.uid() is null then
    raise exception 'No active app session';
  end if;

  select * into p from public.app_profiles where id = p_profile_id;
  if not found then raise exception 'Profile not found'; end if;

  hashed := encode(digest(lower(coalesce(p_password,'')) || coalesce(p.password_salt,''), 'sha256'), 'hex');
  if p.password_hash is null or hashed <> p.password_hash then
    raise exception 'Incorrect password';
  end if;

  update public.app_profiles set owner_id = auth.uid() where id = p.id;

  -- Existing records belong to the selected profile. Rebind their user_id to
  -- the current anonymous session as well, preserving all existing data.
  update public.daily_logs set user_id = auth.uid() where profile_id = p.id;
  update public.meals set user_id = auth.uid() where profile_id = p.id;
  update public.foods set user_id = auth.uid() where profile_id = p.id;
  update public.body_measurements set user_id = auth.uid() where profile_id = p.id;

  select * into p from public.app_profiles where id = p.id;
  return p;
end;
$$;

revoke all on function public.login_profile(uuid, text) from public;
grant execute on function public.login_profile(uuid, text) to anon, authenticated;

-- Password change for an already logged-in profile.
create or replace function public.change_profile_password(p_profile_id uuid, p_current_password text, p_new_password text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  p public.app_profiles;
  new_salt text;
  old_hash text;
begin
  select * into p from public.app_profiles where id=p_profile_id and owner_id=auth.uid();
  if not found then raise exception 'Profile not found'; end if;
  old_hash := encode(digest(lower(coalesce(p_current_password,'')) || coalesce(p.password_salt,''), 'sha256'), 'hex');
  if old_hash <> p.password_hash then raise exception 'Incorrect current password'; end if;
  if length(coalesce(p_new_password,'')) < 4 then raise exception 'Password must be at least 4 characters'; end if;
  new_salt := encode(gen_random_bytes(16), 'hex');
  update public.app_profiles
  set password_salt=new_salt, password_hash=encode(digest(lower(p_new_password)||new_salt,'sha256'),'hex')
  where id=p.id;
  return true;
end;
$$;

revoke all on function public.change_profile_password(uuid, text, text) from public;
grant execute on function public.change_profile_password(uuid, text, text) to anon, authenticated;
