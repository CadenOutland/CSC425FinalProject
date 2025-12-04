const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
  const email = process.argv[2] || 'test@gmail.com';
  const newPassword = process.argv[3] || 'Test1234';
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const hash = await bcrypt.hash(newPassword, 12);
    const res = await pool.query(
      'UPDATE users SET password_hash = $1, is_active = true WHERE email = $2 RETURNING id, email, is_active',
      [hash, email]
    );
    if (res.rowCount === 0) {
      console.log('No user found for', email);
    } else {
      console.log('Password reset for', res.rows[0].email, 'active=', res.rows[0].is_active);
    }
  } catch (e) {
    console.error('Reset failed:', e);
  } finally {
    await pool.end();
  }
}

main();
