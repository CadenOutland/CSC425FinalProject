// User service for database operations and business logic
const User = require('../models/MongoUser');

const userService = {
  // Get user by ID
  getUserById: async (userId) => {
    const user = await User.findById(userId).select('-password_hash').lean();
    if (!user) return null;
    
    // Map MongoDB fields to camelCase for frontend
    return {
      id: user._id.toString(),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      website: user.website,
      profileImage: user.profile_image,
      isActive: user.is_active,
      isVerified: user.is_verified,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  },

  // Get user profile (same as getUserById for now)
  getUserProfile: async (userId) => {
    return await userService.getUserById(userId);
  },

  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    const updateFields = {};

    // Map camelCase to snake_case for MongoDB
    if (profileData.firstName !== undefined) {
      updateFields.first_name = profileData.firstName;
    }
    if (profileData.lastName !== undefined) {
      updateFields.last_name = profileData.lastName;
    }
    if (profileData.email !== undefined) {
      updateFields.email = profileData.email;
    }
    if (profileData.bio !== undefined) {
      updateFields.bio = profileData.bio;
    }
    if (profileData.location !== undefined) {
      updateFields.location = profileData.location;
    }
    if (profileData.website !== undefined) {
      updateFields.website = profileData.website;
    }
    if (profileData.profileImage !== undefined) {
      updateFields.profile_image = profileData.profileImage;
    }

    if (Object.keys(updateFields).length === 0) {
      // No fields to update, just return current user
      return await userService.getUserById(userId);
    }

    // Convert userId to string to ensure it works with MongoDB ObjectId
    const userIdString = String(userId);
    
    const user = await User.findByIdAndUpdate(
      userIdString,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password_hash').lean();

    if (!user) {
      throw new Error('User not found');
    }

    // Map to camelCase for frontend
    return {
      id: user._id.toString(),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      website: user.website,
      profileImage: user.profile_image,
      isActive: user.is_active,
      isVerified: user.is_verified,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  },

  // Get user statistics
  getUserStatistics: async (userId) => {
    // This would integrate with user_statistics collection or aggregation
    // For now, return null or basic stats
    return {
      userId,
      totalChallengesCompleted: 0,
      totalPoints: 0,
      currentStreak: 0,
    };
  },

  // Delete user account
  deleteUserAccount: async (userId) => {
    await User.findByIdAndDelete(userId);
  },
};

module.exports = userService;
