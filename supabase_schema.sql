-- Fat Loss Coach V3.3 / Supabase schema
-- Run this entire script in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  age int not null default 29,
  sex text not null default 'male',
  height_cm numeric not null default 159,
  starting_weight_kg numeric not null default 68,
  activity_level numeric not null default 1.35,
  deficit_kcal int not null default 400,
  calorie_target int not null default 1700,
  protein_target int not null default 120,
  fat_target int not null default 55,
  carb_target int not null default 185,
  baseline jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  day_number int not null default 0,
  calories int not null default 0,
  protein numeric not null default 0,
  fat numeric not null default 0,
  carbs numeric not null default 0,
  exercise_calories int not null default 0,
  steps int not null default 0,
  walking_minutes int not null default 0,
  cycling_minutes int not null default 0,
  workout_completed boolean not null default false,
  weight_kg numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, log_date)
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  daily_log_id uuid not null references public.daily_logs(id) on delete cascade,
  meal_type text not null default 'food',
  food_key text,
  food_name text not null,
  quantity numeric not null default 1,
  unit text not null default 'serving',
  calories numeric not null default 0,
  protein numeric not null default 0,
  fat numeric not null default 0,
  carbs numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  measure_date date not null,
  day_number int not null default 0,
  weight_kg numeric,
  belly_cm numeric,
  waist_cm numeric,
  chest_cm numeric,
  biceps_cm numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_date date not null,
  exercise text not null,
  sets int,
  reps int,
  duration_minutes int,
  estimated_calories int not null default 0,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  serving_size text,
  calories numeric not null default 0,
  protein numeric not null default 0,
  fat numeric not null default 0,
  carbs numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  cooked_weight_g numeric,
  calories_per_100g numeric,
  protein_per_100g numeric,
  fat_per_100g numeric,
  carbs_per_100g numeric,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.daily_logs enable row level security;
alter table public.meals enable row level security;
alter table public.body_measurements enable row level security;
alter table public.workout_logs enable row level security;
alter table public.foods enable row level security;
alter table public.recipes enable row level security;

-- Policies
drop policy if exists "profiles own" on public.profiles; create policy "profiles own" on public.profiles for all to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
drop policy if exists "daily own" on public.daily_logs; create policy "daily own" on public.daily_logs for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists "meals own" on public.meals; create policy "meals own" on public.meals for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists "measure own" on public.body_measurements; create policy "measure own" on public.body_measurements for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists "workout own" on public.workout_logs; create policy "workout own" on public.workout_logs for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists "foods own" on public.foods; create policy "foods own" on public.foods for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists "recipes own" on public.recipes; create policy "recipes own" on public.recipes for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

grant select, insert, update, delete on public.profiles, public.daily_logs, public.meals, public.body_measurements, public.workout_logs, public.foods, public.recipes to authenticated;
