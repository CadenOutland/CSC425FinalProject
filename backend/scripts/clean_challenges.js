const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function cleanChallenges() {
  try {
    console.log('Deleting generic challenges...');
    const result = await pool.query("DELETE FROM challenges WHERE title LIKE '%general Challenge%'");
    console.log(`Deleted ${result.rowCount} generic challenges`);
    
    // Show remaining challenges
    const remaining = await pool.query('SELECT id, title, category FROM challenges ORDER BY id');
    console.log('\nRemaining challenges:');
    console.log(JSON.stringify(remaining.rows, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

cleanChallenges();
