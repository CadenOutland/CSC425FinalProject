// TODO: Implement dashboard overview component
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

const ProgressBar = ({ percent }) => (
  <div className="progress-wrapper">
    <div className="progress-track" style={{ background: '#e5e7eb', borderRadius: 6, height: 16 }}>
      <div className="progress-fill" style={{ width: `${percent}%`, height: 16, background: '#10b981', borderRadius: 6 }} />
    </div>
    <div className="progress-text">{percent}% complete</div>
  </div>
);

const DashboardOverview = () => {
  const [overview, setOverview] = useState({ percentage: 0, completed: 0, goalsCompleted: 0, totalChallenges: 0, totalPoints: 0 });

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
      <h1>Welcome to SkillWise</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Goals Completed</h3>
          <p className="stat-number">{overview.goalsCompleted || 0}</p>
        </div>
        
        <div className="stat-card">
          <h3>Challenges Completed</h3>
          <p className="stat-number">{overview.completed || 0}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Points</h3>
          <p className="stat-number">{overview.totalPoints || 0}</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <h2>Your Progress</h2>
        <ProgressBar percent={overview.percentage || 0} />
      </div>
    </div>
  );
};

export default DashboardOverview;