const db = require('../database/connection');
const { AppError } = require('../middleware/errorHandler');
const { validateGoal } = require('../utils/validators');

const goalService = {
  // Get all goals for a user with filters
  getGoals: async (
    userId,
    { category, status, difficulty, limit = 20, offset = 0 }
  ) => {
    const queryParams = [userId];
    let queryConditions = ['user_id = $1'];
    let paramCount = 1;

    if (category) {
      paramCount++;
      queryParams.push(category);
      queryConditions.push(`category = $${paramCount}`);
    }

    if (status) {
      paramCount++;
      queryParams.push(status);
      queryConditions.push(`status = $${paramCount}`);
    }

    if (difficulty) {
      paramCount++;
      queryParams.push(difficulty);
      queryConditions.push(`difficulty = $${paramCount}`);
    }

    const countQuery = await db.query(
      `SELECT COUNT(*) FROM goals WHERE ${queryConditions.join(' AND ')}`,
      queryParams
    );

    const query = await db.query(
      `SELECT 
        g.*,
        COUNT(c.id) as total_challenges,
        COUNT(CASE WHEN c.status = 'completed' THEN 1 END) as completed_challenges
      FROM goals g
      LEFT JOIN challenges c ON c.goal_id = g.id
      WHERE ${queryConditions.join(' AND ')}
      GROUP BY g.id
      ORDER BY g.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...queryParams, limit, offset]
    );

    return {
      rows: query.rows,
      count: parseInt(countQuery.rows[0].count),
    };
  },

  // Get single goal by ID
  getGoalById: async (goalId, userId) => {
    const result = await db.query(
      `SELECT 
        g.*,
        COUNT(c.id) as total_challenges,
        COUNT(CASE WHEN c.status = 'completed' THEN 1 END) as completed_challenges
      FROM goals g
      LEFT JOIN challenges c ON c.goal_id = g.id
      WHERE g.id = $1 AND g.user_id = $2
      GROUP BY g.id`,
      [goalId, userId]
    );

    return result.rows[0];
  },

  // Create new goal
  createGoal: async ({
    title,
    description,
    category,
    difficulty,
    targetCompletionDate,
    userId,
  }) => {
    // Validate input
    const validation = validateGoal({
      title,
      description,
      category,
      difficulty,
    });
    if (!validation.isValid) {
      throw new AppError(validation.errors[0], 400, 'VALIDATION_ERROR');
    }

    const result = await db.query(
      `INSERT INTO goals (
        title, description, category, difficulty, 
        target_completion_date, user_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [
        title,
        description,
        category,
        difficulty,
        targetCompletionDate,
        userId,
        'active',
      ]
    );

    return result.rows[0];
  },

  // Update goal
  updateGoal: async (goalId, userId, updates) => {
    const allowedUpdates = [
      'title',
      'description',
      'category',
      'difficulty',
      'target_completion_date',
      'status',
    ];

    // Filter out invalid update fields
    const validUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        validUpdates[key] = updates[key];
      }
    });

    if (Object.keys(validUpdates).length === 0) {
      throw new AppError('No valid updates provided', 400, 'VALIDATION_ERROR');
    }

    // Create SQL set string and values array
    const setEntries = Object.entries(validUpdates);
    const setString = setEntries
      .map((entry, index) => `${entry[0]} = $${index + 3}`)
      .join(', ');
    const values = setEntries.map((entry) => entry[1]);

    const result = await db.query(
      `UPDATE goals
      SET ${setString}
      WHERE id = $1 AND user_id = $2
      RETURNING *`,
      [goalId, userId, ...values]
    );

    return result.rows[0];
  },

  // Delete goal
  deleteGoal: async (goalId, userId) => {
    // Start a transaction since we need to delete related records
    return await db.withTransaction(async (client) => {
      // Delete related challenges first
      await client.query('DELETE FROM challenges WHERE goal_id = $1', [goalId]);

      // Then delete the goal
      const result = await client.query(
        'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id',
        [goalId, userId]
      );

      return result.rows.length > 0;
    });
  },

  // Calculate goal progress
  calculateProgress: async (goalId) => {
    const result = await db.query(
      `SELECT 
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::float / COUNT(*)::float * 100 as progress
      FROM challenges 
      WHERE goal_id = $1`,
      [goalId]
    );

    return Math.round(result.rows[0].progress || 0);
  },
};

module.exports = goalService;
