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

## V5.10
Profile login now uses simple name bubbles plus password, without email authentication. The login screen fetches profile names/avatars from Supabase through `list_login_profiles()`. Password verification is handled by the `login_profile()` RPC, which rebinds the selected profile and its existing data to the current anonymous session. Run `supabase_v5_12_migration.sql` once.

Legacy profiles created before V5.10 receive a temporary password equal to the profile name (case-insensitive) during migration. Change this later when password-management UI is added.


V5.10: meal inserts now use the `save_meal` Supabase RPC so food entries reliably persist for the password-selected profile/session. Run `supabase_v5_12_migration.sql` once.

## V5.12.2
Meal persistence now uses a direct authenticated insert first (matching the verified database path), with RPC fallback. Daily totals are persisted after meal save. Visible app version/cache updated to v5.12.2. No new SQL migration required.


V5.12 fixes the missing schedule() runtime error that could stop addFood() before cloud meal persistence, and includes the complete profile-login RPC setup plus meal persistence RPC in one migration.

V5.12.2: Fixed a JavaScript syntax error in the workout schedule text that prevented app.js from loading, which made all inline buttons appear non-functional. Bumped the service-worker cache key.


## V5.13
Profile-scoped daily log fix. The old `daily_logs_user_id_log_date_key` constraint was incompatible with multiple named profiles sharing the same anonymous Supabase session. V5.13 drops that constraint and adds a unique index on `profile_id, log_date`, matching the app's daily-log upsert. The profile login function also explicitly calls `extensions.digest()` because pgcrypto is installed in the `extensions` schema. Run `supabase_v5_13_migration.sql` once. No existing profile, meal, workout, or history rows are deleted.
