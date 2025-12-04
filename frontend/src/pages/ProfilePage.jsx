// TODO: Implement user profile management and settings
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [formInitialized, setFormInitialized] = useState(false);
  const [goals, setGoals] = useState([]);
  const { user, updateProfile } = useAuth();

  // Fetch real profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      
      try {
        // Fetch progress stats
        const progressResponse = await apiService.progress.getOverview();
        const progressData = progressResponse.data?.data || progressResponse.data || {};

        // Fetch goals count
        const goalsResponse = await apiService.goals.getAll();
        const goalsData = goalsResponse.data?.data || goalsResponse.data || [];
        const completedGoals = goalsData.filter(g => g.is_completed).length;
        
        // Store goals for Skills tab
        setGoals(goalsData);

        // Calculate level from points
        const totalPoints = Number(progressData.totalPoints || 0);
        const level = Math.floor(totalPoints / 100) + 1;

        const profileDataFromApi = {
          id: user?.id || 1,
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          avatar: '👤',
          bio: user?.bio || '',
          location: user?.location || '',
          website: user?.website || '',
          joinedDate: user?.createdAt || new Date().toISOString(),
          level: level,
          totalPoints: totalPoints,
          completedChallenges: Number(progressData.completed || 0),
          goalsAchieved: completedGoals,
          currentStreak: 0, // Not tracked yet
          longestStreak: 0, // Not tracked yet
          badges: [
            { id: 1, name: 'First Steps', icon: '🚀', description: 'Completed first challenge', earned: progressData.completed >= 1 },
            { id: 2, name: 'Streak Master', icon: '🔥', description: '7-day learning streak', earned: false },
            { id: 3, name: 'Goal Crusher', icon: '🎯', description: 'Completed 5 learning goals', earned: completedGoals >= 5 },
            { id: 4, name: 'Code Reviewer', icon: '👥', description: 'Provided 10 peer reviews', earned: false },
            { id: 5, name: 'Challenge Master', icon: '💪', description: 'Completed 50 challenges', earned: progressData.completed >= 50 }
          ],
          skills: [],
          recentActivity: [],
          preferences: {
            emailNotifications: true,
            pushNotifications: false,
            weeklyDigest: true,
            publicProfile: true,
            showProgress: true
          }
        };

        setProfileData(profileDataFromApi);
        
        // Only initialize formData once on first load
        if (!formInitialized) {
          setFormData(profileDataFromApi);
          setFormInitialized(true);
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user, formInitialized]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditClick = () => {
    if (!isEditing && profileData) {
      // Populate formData with current profileData when entering edit mode
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        website: profileData.website || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Submitting profile update:', formData);
      
      // Call the API to update the profile
      const result = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
      });
      
      console.log('Update result:', result);
      
      if (result.success) {
        // Update local state with the returned user data
        setProfileData(prev => ({
          ...prev,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          bio: result.user.bio || '',
          location: result.user.location || '',
          website: result.user.website || '',
        }));
        setFormData(prev => ({
          ...prev,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          bio: result.user.bio || '',
          location: result.user.location || '',
          website: result.user.website || '',
        }));
        setIsEditing(false);
        console.log('✅ Profile updated successfully');
        alert('Profile updated successfully!');
      } else {
        console.error('Update failed:', result.error);
        alert(`Failed to save profile: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      alert('Failed to save profile changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      challenge: '🏆',
      goal: '🎯',
      review: '👥',
      streak: '🔥'
    };
    return icons[type] || '📝';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading && !profileData) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-banner">
          <div className="profile-info">
            <div className="profile-avatar">
              <span className="avatar-icon">{profileData?.avatar}</span>
              <div className="level-badge">Level {profileData?.level}</div>
            </div>
            
            <div className="profile-details">
              <h1>{profileData?.firstName} {profileData?.lastName}</h1>
              <p className="profile-bio">{profileData?.bio || 'No bio yet'}</p>
              <div className="profile-meta">
                <span>📍 {profileData?.location || 'Location not set'}</span>
                <span>📅 Joined {formatDate(profileData?.joinedDate)}</span>
                {profileData?.website && (
                  <span>🌐 <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                    {profileData.website}
                  </a></span>
                )}
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <strong>{profileData?.totalPoints.toLocaleString()}</strong>
                <span>Total Points</span>
              </div>
              <div className="stat-item">
                <strong>{profileData?.completedChallenges}</strong>
                <span>Challenges</span>
              </div>
              <div className="stat-item">
                <strong>{profileData?.currentStreak}</strong>
                <span>Day Streak</span>
              </div>
            </div>

            <button 
              className="btn-primary"
              onClick={handleEditClick}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          Skills
        </button>
        <button
          className={`tab-button ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          Badges
        </button>
        <button
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="profile-content">
        {isEditing && (
          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {activeTab === 'overview' && !isEditing && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {profileData?.recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="activity-info">
                        <h4>{activity.title}</h4>
                        <div className="activity-meta">
                          <span>{formatTimeAgo(activity.date)}</span>
                          <span className="points">+{activity.points} points</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="achievements-summary">
                <h3>Achievements</h3>
                <div className="achievements-stats">
                  <div className="achievement-stat">
                    <strong>{profileData?.goalsAchieved}</strong>
                    <span>Goals Achieved</span>
                  </div>
                  <div className="achievement-stat">
                    <strong>{profileData?.longestStreak}</strong>
                    <span>Longest Streak</span>
                  </div>
                  <div className="achievement-stat">
                    <strong>{profileData?.badges.filter(b => b.earned).length}</strong>
                    <span>Badges Earned</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && !isEditing && (
          <div className="skills-tab">
            <h3>Learning Goals Progress</h3>
            {goals.length === 0 ? (
              <div className="empty-state">
                <p>No learning goals yet. Create a goal to track your progress!</p>
              </div>
            ) : (
              <div className="skills-grid">
                {goals.map((goal) => (
                  <div key={goal.id} className="skill-item">
                    <div className="skill-header">
                      <h4>{goal.title}</h4>
                      <span className={`skill-category ${goal.is_completed ? 'completed' : 'in-progress'}`}>
                        {goal.is_completed ? '✓ Completed' : 'In Progress'}
                      </span>
                    </div>
                    {goal.description && (
                      <p className="goal-description">{goal.description}</p>
                    )}
                    <div className="skill-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${goal.progress_percentage || 0}%` }}
                        ></div>
                      </div>
                      <span className="skill-level">{goal.progress_percentage || 0}%</span>
                    </div>
                    <div className="goal-meta">
                      <span className="goal-difficulty">
                        {goal.difficulty_level || 'All Levels'}
                      </span>
                      {goal.category && (
                        <span className="goal-category">
                          Category: {goal.category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'badges' && !isEditing && (
          <div className="badges-tab">
            <h3>Badge Collection</h3>
            <div className="badges-grid">
              {profileData?.badges.map((badge) => (
                <div key={badge.id} className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}>
                  <div className="badge-icon">{badge.icon}</div>
                  <h4>{badge.name}</h4>
                  <p>{badge.description}</p>
                  {badge.earned ? (
                    <span className="badge-status earned">Earned ✓</span>
                  ) : (
                    <span className="badge-status locked">Locked 🔒</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && !isEditing && (
          <div className="settings-tab">
            <div className="settings-section">
              <h3>Notification Preferences</h3>
              <div className="settings-group">
                <label className="setting-item">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.preferences?.emailNotifications || false}
                    onChange={handleInputChange}
                  />
                  <span>Email notifications</span>
                </label>
                
                <label className="setting-item">
                  <input
                    type="checkbox"
                    name="pushNotifications"
                    checked={formData.preferences?.pushNotifications || false}
                    onChange={handleInputChange}
                  />
                  <span>Push notifications</span>
                </label>
                
                <label className="setting-item">
                  <input
                    type="checkbox"
                    name="weeklyDigest"
                    checked={formData.preferences?.weeklyDigest || false}
                    onChange={handleInputChange}
                  />
                  <span>Weekly progress digest</span>
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h3>Privacy Settings</h3>
              <div className="settings-group">
                <label className="setting-item">
                  <input
                    type="checkbox"
                    name="publicProfile"
                    checked={formData.preferences?.publicProfile || false}
                    onChange={handleInputChange}
                  />
                  <span>Public profile</span>
                </label>
                
                <label className="setting-item">
                  <input
                    type="checkbox"
                    name="showProgress"
                    checked={formData.preferences?.showProgress || false}
                    onChange={handleInputChange}
                  />
                  <span>Show progress on leaderboard</span>
                </label>
              </div>
            </div>

            <div className="settings-actions">
              <button 
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;