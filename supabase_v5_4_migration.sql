-- Fat Loss Coach V5.4
-- Required so individual exercise counts survive browser reloads.
ALTER TABLE daily_logs
ADD COLUMN IF NOT EXISTS workout_data jsonb NOT NULL DEFAULT '{}'::jsonb;
