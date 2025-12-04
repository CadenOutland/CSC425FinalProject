-- Migration 014: Fix user_id types to support MongoDB string IDs
-- Change user_id from INTEGER to VARCHAR(255) in progress_events and user_statistics

-- Drop foreign key constraints first
ALTER TABLE progress_events 
  DROP CONSTRAINT IF EXISTS progress_events_user_id_fkey;

ALTER TABLE user_statistics 
  DROP CONSTRAINT IF EXISTS user_statistics_user_id_fkey;

-- Change column types
ALTER TABLE progress_events 
  ALTER COLUMN user_id TYPE VARCHAR(255);

ALTER TABLE user_statistics 
  ALTER COLUMN user_id TYPE VARCHAR(255);

-- Recreate indexes
DROP INDEX IF EXISTS idx_progress_events_user_id;
CREATE INDEX idx_progress_events_user_id ON progress_events(user_id);

DROP INDEX IF EXISTS idx_user_stats_user_id;
CREATE INDEX idx_user_stats_user_id ON user_statistics(user_id);
