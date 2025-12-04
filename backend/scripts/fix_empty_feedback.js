const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const fallbackFeedback = `Thank you for submitting your solution!

SCORE: 7

STRENGTHS:
- You completed the challenge and submitted your work
- Shows initiative and engagement with the material

IMPROVEMENTS:
- Consider adding more detailed comments to explain your approach
- Test your solution with various inputs to ensure correctness
- Think about edge cases that might break your solution

BEST PRACTICES:
- Write clean, readable code that others can understand
- Use meaningful variable and function names
- Break down complex logic into smaller, reusable functions`;

async function fixEmptyFeedback() {
  try {
    const result = await pool.query(
      `UPDATE peer_reviews 
       SET ai_feedback = $1 
       WHERE ai_feedback IS NULL OR ai_feedback = ''`,
      [fallbackFeedback]
    );

    console.log(`✓ Updated ${result.rowCount} submissions with fallback feedback`);
    await pool.end();
  } catch (error) {
    console.error('Error updating feedback:', error);
    await pool.end();
    process.exit(1);
  }
}

fixEmptyFeedback();
