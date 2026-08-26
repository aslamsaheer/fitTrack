
-- Fat Loss Coach V5 named profiles
create table if not exists app_profiles(
 id uuid primary key,
 owner_id uuid not null references auth.users(id) on delete cascade,
 name text not null,
 avatar text default '👤',
 age int default 29,
 height_cm numeric default 159,
 starting_weight_kg numeric default 68,
 start_date date default current_date,
 calorie_target int default 1700,
 protein_target int default 120,
 fat_target int default 55,
 carb_target int default 185,
 created_at timestamptz default now()
);

alter table daily_logs add column if not exists profile_id uuid;
alter table meals add column if not exists profile_id uuid;
alter table foods add column if not exists profile_id uuid;
alter table body_measurements add column if not exists profile_id uuid;

alter table app_profiles enable row level security;
drop policy if exists "app profiles owner" on app_profiles;
create policy "app profiles owner" on app_profiles for all using (auth.uid()=owner_id) with check (auth.uid()=owner_id);

drop policy if exists "daily profile owner" on daily_logs;
create policy "daily profile owner" on daily_logs for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
drop policy if exists "meals profile owner" on meals;
create policy "meals profile owner" on meals for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
drop policy if exists "foods profile owner" on foods;
create policy "foods profile owner" on foods for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
drop policy if exists "measure profile owner" on body_measurements;
create policy "measure profile owner" on body_measurements for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

create index if not exists daily_logs_profile_date_idx on daily_logs(profile_id,date);
create index if not exists meals_profile_date_idx on meals(profile_id,date);
create index if not exists foods_profile_idx on foods(profile_id);
create index if not exists measurements_profile_date_idx on body_measurements(profile_id,date);

-- One daily record per named profile.
do $$ begin
  if not exists (select 1 from pg_constraint where conname='daily_logs_profile_date_key') then
    alter table daily_logs add constraint daily_logs_profile_date_key unique(profile_id,date);
  end if;
exception when duplicate_object then null;
end $$;

-- IMPORTANT: In Supabase Dashboard enable Authentication -> Providers -> Anonymous Sign-Ins.
-- The website uses anonymous auth only for secure cloud ownership; no email/password is requested.
