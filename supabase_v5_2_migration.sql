-- Fat Loss Coach V5.2
-- Adds optional starting body measurements to named profiles.
ALTER TABLE app_profiles ADD COLUMN IF NOT EXISTS starting_waist_cm numeric;
ALTER TABLE app_profiles ADD COLUMN IF NOT EXISTS starting_belly_cm numeric;
ALTER TABLE app_profiles ADD COLUMN IF NOT EXISTS starting_chest_cm numeric;
ALTER TABLE app_profiles ADD COLUMN IF NOT EXISTS starting_biceps_cm numeric;
