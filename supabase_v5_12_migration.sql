-- Fat Loss Coach V5.12
-- Complete simple profile login + reliable meal persistence.
-- Run once in Supabase SQL Editor.

create extension if not exists pgcrypto;

alter table public.app_profiles
  add column if not exists password_salt text,
  add column if not exists password_hash text;

-- Give legacy profiles a one-time default password equal to their name.
update public.app_profiles
set password_salt = encode(gen_random_bytes(16), 'hex')
where password_salt is null;

update public.app_profiles
set password_hash = encode(digest(lower(name) || password_salt, 'sha256'), 'hex')
where password_hash is null;

-- Login screen: expose only the fields needed for the profile bubbles.
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

-- Verify the simple profile password and bind that profile's existing data
-- to the current anonymous app session.
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

-- Reliable meal insert. The function checks the selected profile and daily log
-- against the current anonymous session before inserting the meal.
create or replace function public.save_meal(
  p_profile_id uuid,
  p_daily_log_id uuid,
  p_meal_type text,
  p_food_key text,
  p_food_name text,
  p_quantity numeric,
  p_unit text,
  p_calories numeric,
  p_protein numeric,
  p_fat numeric,
  p_carbs numeric
)
returns public.meals
language plpgsql
security definer
set search_path = public
as $$
declare
  m public.meals;
begin
  if auth.uid() is null then
    raise exception 'No active app session';
  end if;

  if not exists (
    select 1 from public.app_profiles
    where id = p_profile_id and owner_id = auth.uid()
  ) then
    raise exception 'Profile is not connected to this device session';
  end if;

  if not exists (
    select 1 from public.daily_logs
    where id = p_daily_log_id and profile_id = p_profile_id
  ) then
    raise exception 'Daily log does not belong to this profile';
  end if;

  insert into public.meals (
    user_id, profile_id, daily_log_id, meal_type, food_key, food_name,
    quantity, unit, calories, protein, fat, carbs
  ) values (
    auth.uid(), p_profile_id, p_daily_log_id, coalesce(p_meal_type,'food'),
    p_food_key, p_food_name, coalesce(p_quantity,1), coalesce(p_unit,'serving'),
    coalesce(p_calories,0), coalesce(p_protein,0), coalesce(p_fat,0), coalesce(p_carbs,0)
  )
  returning * into m;

  return m;
end;
$$;

revoke all on function public.save_meal(uuid,uuid,text,text,text,numeric,text,numeric,numeric,numeric,numeric) from public;
grant execute on function public.save_meal(uuid,uuid,text,text,text,numeric,text,numeric,numeric,numeric,numeric) to anon, authenticated;
