const db = require('../database/connection');
const bcrypt = require('bcryptjs');
const { validateEmail, validatePassword } = require('../utils/validators');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.profileImage = data.profile_image;
    this.bio = data.bio;
    this.isActive = data.is_active;
    this.isVerified = data.is_verified;
    this.role = data.role;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.lastLogin = data.last_login;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [
      email.toLowerCase(),
    ]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  static async create(userData) {
    const { email, password, firstName, lastName, profileImage, bio } =
      userData;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      throw new Error('Required fields missing');
    }

    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }

    // Check if user exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.withTransaction(async (query) => {
      // Insert user
      const userResult = await query(
        `INSERT INTO users (
          email, password_hash, first_name, last_name, 
          profile_image, bio
        ) VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [
          email.toLowerCase(),
          passwordHash,
          firstName,
          lastName,
          profileImage || null,
          bio || null,
        ]
      );

      // Initialize user statistics
      await query('INSERT INTO user_statistics (user_id) VALUES ($1)', [
        userResult.rows[0].id,
      ]);

      return userResult;
    });

    return new User(result.rows[0]);
  }

  async updateProfile(data) {
    const allowedUpdates = ['first_name', 'last_name', 'profile_image', 'bio'];

    // Filter out undefined values and non-allowed fields
    const updates = Object.entries(data).filter(
      ([key, value]) => allowedUpdates.includes(key) && value !== undefined
    );

    if (updates.length === 0) {
      return this;
    }

    // Construct update query
    const setClause = updates
      .map((_, index) => `${updates[index][0]} = $${index + 1}`)
      .join(', ');

    const values = updates.map(([_, value]) => value);
    values.push(this.id);

    const result = await db.query(
      `UPDATE users 
       SET ${setClause} 
       WHERE id = $${values.length} 
       RETURNING *`,
      values
    );

    return new User(result.rows[0]);
  }

  async verifyPassword(password) {
    const result = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [this.id]
    );
    return bcrypt.compare(password, result.rows[0].password_hash);
  }

  async changePassword(currentPassword, newPassword) {
    // Verify current password
    const isValid = await this.verifyPassword(currentPassword);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }

    // Hash and update password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
      passwordHash,
      this.id,
    ]);
  }

  async updateLastLogin() {
    const result = await db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 RETURNING last_login',
      [this.id]
    );
    this.lastLogin = result.rows[0].last_login;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      profileImage: this.profileImage,
      bio: this.bio,
      isActive: this.isActive,
      isVerified: this.isVerified,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLogin: this.lastLogin,
    };
  }
}

module.exports = User;
