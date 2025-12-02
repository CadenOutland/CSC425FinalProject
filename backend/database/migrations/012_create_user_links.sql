-- Migration 012: Create user_links table (Mongo ↔ SQL user mapping)

CREATE TABLE IF NOT EXISTS user_links (
  id SERIAL PRIMARY KEY,
  mongo_id VARCHAR(80) UNIQUE NOT NULL,
  sql_user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_links_mongo_id ON user_links(mongo_id);
CREATE INDEX idx_user_links_sql_user_id ON user_links(sql_user_id);
