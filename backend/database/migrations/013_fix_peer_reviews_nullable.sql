-- Migration 013: Make review_text nullable for AI submissions

ALTER TABLE peer_reviews ALTER COLUMN review_text DROP NOT NULL;
ALTER TABLE peer_reviews ALTER COLUMN rating DROP NOT NULL;
