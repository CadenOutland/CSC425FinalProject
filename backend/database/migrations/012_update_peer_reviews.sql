-- Migration 012: Update peer reviews table to support AI challenge submissions

-- Drop existing foreign key constraints
ALTER TABLE peer_reviews DROP CONSTRAINT IF EXISTS peer_reviews_reviewer_id_fkey;
ALTER TABLE peer_reviews DROP CONSTRAINT IF EXISTS peer_reviews_reviewee_id_fkey;
ALTER TABLE peer_reviews DROP CONSTRAINT IF EXISTS peer_reviews_submission_id_fkey;

-- Modify columns to support both integer IDs and MongoDB ObjectIds
ALTER TABLE peer_reviews ALTER COLUMN reviewer_id DROP NOT NULL;
ALTER TABLE peer_reviews ALTER COLUMN reviewer_id TYPE VARCHAR(255);
ALTER TABLE peer_reviews DROP COLUMN IF EXISTS reviewee_id;

-- Add new columns for AI challenge submissions
ALTER TABLE peer_reviews ADD COLUMN IF NOT EXISTS submission_user_id VARCHAR(255) NOT NULL;
ALTER TABLE peer_reviews ADD COLUMN IF NOT EXISTS challenge_title VARCHAR(500);
ALTER TABLE peer_reviews ADD COLUMN IF NOT EXISTS challenge_description TEXT;
ALTER TABLE peer_reviews ADD COLUMN IF NOT EXISTS solution_code TEXT;
ALTER TABLE peer_reviews ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50);
ALTER TABLE peer_reviews ADD COLUMN IF NOT EXISTS ai_feedback TEXT;
ALTER TABLE peer_reviews ADD COLUMN IF NOT EXISTS ai_score INTEGER;
ALTER TABLE peer_reviews ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

-- Modify submission_id to support custom IDs
ALTER TABLE peer_reviews ALTER COLUMN submission_id TYPE VARCHAR(255);

-- Update indexes
DROP INDEX IF EXISTS idx_peer_reviews_reviewer_id;
DROP INDEX IF EXISTS idx_peer_reviews_reviewee_id;
DROP INDEX IF EXISTS idx_peer_reviews_unique;

CREATE INDEX IF NOT EXISTS idx_peer_reviews_reviewer_id ON peer_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_peer_reviews_submission_user_id ON peer_reviews(submission_user_id);
CREATE INDEX IF NOT EXISTS idx_peer_reviews_status ON peer_reviews(status);
