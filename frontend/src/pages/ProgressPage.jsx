import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProgressPage = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch overview data
        const overviewResponse = await apiService.progress.getOverview();
        const overview = overviewResponse.data?.data || overviewResponse.data;

        // Fetch activity data
        const activityResponse = await apiService.progress.getActivity({
          timeframe,
        });
        const activity =
          activityResponse.data?.data || activityResponse.data || [];

        // Calculate level based on total points (100 points per level)
        const totalPoints = overview.totalPoints || 0;
        const level = Math.floor(totalPoints / 100) + 1;
        const experiencePoints = totalPoints % 100;
        const nextLevelXP = 100;

        // Transform backend data to frontend format
        const transformedData = {
          overall: {
            totalPoints,
            level,
            experiencePoints,
            nextLevelXP,
            completedGoals: overview.goalsCompleted || 0,
            completedChallenges: overview.completed || 0,
            totalChallenges: overview.totalChallenges || 0,
            averageScore: overview.averageScore || 0,
            percentage: overview.percentage || 0,
          },
          recentActivity: Array.isArray(activity) ? activity.slice(0, 10) : [],
          weeklyProgress: [],
          skillBreakdown: [],
        };

        setProgressData(transformedData);
      } catch (err) {
        console.error('Failed to fetch progress:', err);
        setError(err.response?.data?.message || 'Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [timeframe]);

  if (loading) {
    return <LoadingSpinner message="Loading your progress..." />;
  }

  if (error) {
    return (
      <div className="progress-page">
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="progress-page">
        <div className="empty-state">
          <p>No progress data available yet. Start completing challenges!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-page">
      <div className="page-header">
        <h1>Your Learning Progress</h1>
        <p>Track your journey and celebrate your achievements</p>
      </div>

      <div className="progress-overview">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>{progressData.overall.totalPoints}</h3>
              <p>Total Points</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>Level {progressData.overall.level}</h3>
              <p>Current Level</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      (progressData.overall.experiencePoints /
                        progressData.overall.nextLevelXP) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <small>
                {progressData.overall.experiencePoints}/
                {progressData.overall.nextLevelXP} XP
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{progressData.overall.completedGoals}</h3>
              <p>Goals Completed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <h3>{progressData.overall.completedChallenges}</h3>
              <p>Challenges Done</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h3>{progressData.overall.percentage}%</h3>
              <p>Overall Progress</p>
              <small>
                {progressData.overall.completedChallenges} of{' '}
                {progressData.overall.totalChallenges} challenges
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="progress-sections">
        <div className="section-row">
          {progressData.recentActivity.length > 0 && (
            <div className="recent-activity-section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {progressData.recentActivity.map((activity, idx) => (
                  <div key={activity.id || idx} className="activity-item">
                    <div className="activity-icon">
                      {activity.event_type === 'challenge_completed' && '🚀'}
                      {activity.event_type === 'goal_progress' && '🎯'}
                      {activity.event_type === 'achievement' && '🏆'}
                      {!activity.event_type && '📝'}
                    </div>
                    <div className="activity-content">
                      <h4>{activity.event_type || 'Activity'}</h4>
                      <p>
                        {activity.points_earned &&
                          `+${activity.points_earned} points`}
                      </p>
                      <small>
                        {activity.timestamp_occurred
                          ? new Date(
                              activity.timestamp_occurred
                            ).toLocaleDateString()
                          : 'Recently'}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {progressData.recentActivity.length === 0 && (
            <div className="recent-activity-section">
              <h2>Recent Activity</h2>
              <div className="empty-state">
                <p>
                  No recent activity yet. Complete challenges to see your
                  progress here!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
