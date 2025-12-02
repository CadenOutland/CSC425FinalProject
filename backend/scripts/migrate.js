#!/usr/bin/env node

/**
 * Database Migration Runner (Windows-safe, VSCode-safe)
 */

const path = require("path");

// ALWAYS load .env from backend/.env using absolute path
require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

console.log("Loaded DB from migrate:", process.env.DATABASE_URL);

const fs = require("fs");
const { Pool } = require("pg");

// Create Postgres connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const migrationsDir = path.join(__dirname, "../database/migrations");

async function runMigrations() {
  try {
    console.log("🚀 Starting database migrations...");

    if (!process.env.DATABASE_URL) {
      console.error("❌ ERROR: No DATABASE_URL found in .env");
      process.exit(1);
    }

    // Create migrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const result = await pool.query(
        "SELECT filename FROM migrations WHERE filename = $1",
        [file]
      );

      if (result.rows.length > 0) {
        console.log(`⏭️  Skipping: ${file} (already executed)`);
        continue;
      }

      console.log(`📄 Running migration: ${file}`);

      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

      try {
        await pool.query(sql);
        await pool.query(
          "INSERT INTO migrations (filename) VALUES ($1)",
          [file]
        );
        console.log(`✅ Completed: ${file}`);
      } catch (err) {
        console.error(`❌ FAILED: ${file}`);
        console.error(err);
        process.exit(1);
      }
    }

    console.log("🎉 All migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };

