# Fat Loss Coach V5 — Named Profiles

## Supabase setup
1. Supabase Dashboard → Authentication → Providers.
2. Enable **Anonymous Sign-Ins**.
3. SQL Editor → run `supabase_v5_migration.sql`.
4. Do not put the database password in the website.

Email/password login is removed. The app silently creates an anonymous Supabase session and then lets the user create named profiles.

## Profiles
Each named profile gets its own:
- meals
- daily calorie/protein/fat/carb logs
- workouts
- weight
- measurements
- saved foods
- start date and targets

Profiles are stored in `app_profiles` and data rows reference `profile_id`.
