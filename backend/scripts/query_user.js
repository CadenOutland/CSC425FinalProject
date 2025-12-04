const { Pool } = require('pg');

async function main() {
  const email = process.argv[2] || 'test@gmail.com';
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query(
      'SELECT id, email, first_name, last_name, created_at FROM users WHERE email = $1',
      [email]
    );
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error('Query failed:', e);
  } finally {
    await pool.end();
  }
}

main();
