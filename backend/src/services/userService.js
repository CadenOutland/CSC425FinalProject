const db = require('../database/connection');
const { AppError } = require('../middleware/errorHandler');

const userService = {

  getUserById: async (userId) => {
    const { rows } = await db.query(
      `SELECT id, first_name, last_name, email, profile_image, bio,
              role, created_at, updated_at 
       FROM users WHERE id = $1`,
      [userId]
    );

    if (!rows[0]) throw new AppError('User not found', 404);
    return rows[0];
  },

  updateProfile: async (userId, data) => {
    const updates = [];
    const values = [];
    let i = 1;

    for (const key of ['first_name', 'last_name', 'bio', 'profile_image']) {
      if (data[key]) {
        updates.push(`${key} = $${i}`);
        values.push(data[key]);
        i++;
      }
    }

    if (updates.length === 0)
      throw new AppError('No valid fields to update', 400);

    values.push(userId);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${i}
      RETURNING id, first_name, last_name, email, bio, profile_image, role
    `;

    const { rows } = await db.query(query, values);
    return rows[0];
  },

  deleteUser: async (userId) => {
    await db.query('DELETE FROM users WHERE id = $1', [userId]);
    return { success: true };
  },

  getUserStats: async (userId) => {
    const { rows } = await db.query(
      'SELECT * FROM user_statistics WHERE user_id = $1',
      [userId]
    );
    return rows[0] || {
      total_points: 0,
      total_challenges_completed: 0,
      average_score: 0
    };
  }
};

module.exports = userService;
