-- Fat Loss Coach V5.10
-- Reliable meal persistence for the password-selected anonymous profile.
-- Run once in Supabase SQL Editor after V5.9.

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

  -- The selected profile must belong to the current anonymous app session.
  if not exists (
    select 1 from public.app_profiles
    where id = p_profile_id and owner_id = auth.uid()
  ) then
    raise exception 'Profile is not connected to this device session';
  end if;

  -- The daily log must belong to the same profile.
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
