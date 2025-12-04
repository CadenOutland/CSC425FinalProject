// TODO: Implement dashboard overview component
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import './DashboardOverview.css';

const ProgressBar = ({ percent }) => (
  <div className="progress-wrapper">
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${percent}%` }} />
    </div>
    <div className="progress-text">{Math.round(percent)}% complete</div>
  </div>
);

const DashboardOverview = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState({
    percentage: 0,
    completed: 0,
    goalsCompleted: 0,
    totalChallenges: 0,
    totalPoints: 0,
    level: 1,
    experiencePoints: 0,
    nextLevelXP: 100,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiService.progress.getOverview();
        const data = res.data?.data || res.data;
        setOverview(data || overview);
      } catch (err) {
        console.error('Failed to fetch progress overview', err);
      }
    };

    fetch();
  }, []);

  return (
    <div className="dashboard-overview">
      <div className="welcome-section">
        <h1>Welcome back, {user?.first_name || 'Student'}! 👋</h1>
        <p>Continue your learning journey and achieve your goals</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{overview.goalsCompleted || 0}</h3>
            <p>Goals Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <h3>{overview.completed || 0}</h3>
            <p>Challenges Done</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{overview.totalPoints || 0}</h3>
            <p>Total Points</p>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <h2>Your Progress - Level {overview.level || 1}</h2>
        <ProgressBar
          percent={
            ((overview.experiencePoints || 0) / (overview.nextLevelXP || 100)) *
            100
          }
        />
        <p className="progress-detail">
          {overview.experiencePoints || 0}/{overview.nextLevelXP || 100} XP to
          Level {(overview.level || 1) + 1}
        </p>
      </div>
    </div>
  );
};

export default DashboardOverview;
