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


## V5.1
The website is aligned with the actual existing schema: `daily_logs.log_date`, `meals.daily_log_id`, `foods` nutrient columns, and `body_measurements.measure_date`. The V5 migration has already been run successfully; do not rerun it.


## V5.2
Run `supabase_v5_2_migration.sql` once. It adds optional starting waist, belly, chest and biceps columns to `app_profiles`.


## V5.4 Persistence fix
Run `supabase_v5_4_migration.sql` once. It adds `daily_logs.workout_data` so individual exercise counts persist in Supabase. V5.4 uses `daily_logs.log_date` and `meals.daily_log_id` from the actual database schema.


## V5.5
Meal persistence fix: uses only actual `meals` columns, returns the inserted row, and displays the exact Supabase error if the insert is rejected. No database migration required.


## V5.6
Fixed the meal persistence path and added explicit Supabase save/update errors and a diagnostic `testMealCloud()` helper. No database migration required.


## V5.7
Removed the obsolete Activity Windows / Save Activity section. Added estimated exercise calorie burn and remaining-target progress at the top of Workout. No database migration required.

## V5.8
Profile selection persistence fix. Existing named profiles are cached locally after they are loaded/created, so the profile gate can still show the user's profiles if the anonymous Supabase session is temporarily unavailable. No database migration required.
