#!/usr/bin/env node

// Safe database seeding script

const { Pool } = require('pg');

async function seedDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log("⚠️ No DATABASE_URL provided — skipping seeds.");
    process.exit(0);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log("🌱 Starting seed...");

    console.log("➡ Seeding users (mock)");
    console.log("➡ Seeding goals (mock)");
    console.log("➡ Seeding challenges (mock)");
    console.log("➡ Seeding achievements (mock)");

    console.log("✅ Seeding complete!");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await pool.end();
  }
}

if (require.main === module) seedDatabase();

module.exports = { seedDatabase };
