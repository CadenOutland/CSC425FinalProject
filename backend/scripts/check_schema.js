const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkSchema() {
  try {
    // Check user_statistics.user_id type
    const statsResult = await pool.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'user_statistics' AND column_name = 'user_id'
    `);
    console.log('user_statistics.user_id:', JSON.stringify(statsResult.rows, null, 2));

    // Check users.id type
    const usersResult = await pool.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'id'
    `);
    console.log('users.id:', JSON.stringify(usersResult.rows, null, 2));

    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
  }
}

checkSchema();
