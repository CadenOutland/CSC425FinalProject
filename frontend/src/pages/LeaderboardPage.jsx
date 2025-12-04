import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch real leaderboard data from backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.leaderboard.getGlobal({ limit: 100 });
        const data = response.data?.data || response.data || [];

        // Map backend data to frontend format
        const mapped = data.map((entry, idx) => {
          const firstName = entry.first_name || '';
          const lastName = entry.last_name || '';
          const displayName =
            firstName && lastName
              ? `${firstName} ${lastName}`
              : entry.email?.split('@')[0] || 'User';

          const totalPoints = Number(entry.total_points || 0);
          const level = Math.floor(totalPoints / 100) + 1;

          return {
            id: entry.id || entry.user_id || idx,
            rank: idx + 1,
            name: displayName,
            avatar: '👤',
            points: totalPoints,
            level: level,
            completedChallenges: Number(entry.challenges_completed || 0),
            averageScore: Number(entry.average_score || 0),
            isCurrentUser: user && entry.id === user.id,
          };
        });

        setLeaderboardData(mapped);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setError(err.response?.data?.message || 'Failed to load leaderboard');
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const currentUserRank =
    leaderboardData.find((user) => user.isCurrentUser)?.rank || 0;

  return (
    <div className="leaderboard-page">
      <div className="page-header">
        <h1>Leaderboard</h1>
        <p>See how you compare with other learners</p>
      </div>

      {currentUserRank > 0 && (
        <div className="user-rank-summary">
          <div className="rank-card current-user">
            <h3>Your Ranking</h3>
            <div className="rank-info">
              <span className="rank-number">#{currentUserRank}</span>
              <div className="rank-details">
                <p>
                  You're in the top{' '}
                  {Math.round((currentUserRank / leaderboardData.length) * 100)}
                  % of learners!
                </p>
                <small>Keep learning to climb higher!</small>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="leaderboard-content">
        {loading ? (
          <LoadingSpinner message="Loading leaderboard..." />
        ) : error ? (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="empty-state">
            <p>
              No leaderboard data available yet. Complete challenges to get on
              the board!
            </p>
          </div>
        ) : (
          <>
            <div className="podium-section">
              <h2>Top Performers</h2>
              <div className="podium">
                {leaderboardData.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className={`podium-position position-${index + 1}`}
                  >
                    <div className="podium-user">
                      <div className="user-avatar">{user.avatar}</div>
                      <h4>{user.name}</h4>
                      <p>{user.points} points</p>
                      <span className="level-badge">Level {user.level}</span>
                    </div>
                    <div className="podium-rank">{getRankIcon(user.rank)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="full-rankings">
              <h2>Complete Rankings</h2>
              <div className="rankings-table">
                <div className="table-header">
                  <div className="col-rank">Rank</div>
                  <div className="col-user">User</div>
                  <div className="col-points">Points</div>
                  <div className="col-level">Level</div>
                  <div className="col-challenges">Challenges</div>
                </div>

                {leaderboardData.map((user) => (
                  <div
                    key={user.id}
                    className={`table-row ${
                      user.isCurrentUser ? 'current-user' : ''
                    }`}
                  >
                    <div className="col-rank">
                      <span className="rank-icon">
                        {getRankIcon(user.rank)}
                      </span>
                    </div>
                    <div className="col-user">
                      <div className="user-info">
                        <span className="user-avatar">{user.avatar}</span>
                        <span className="user-name">
                          {user.name}
                          {user.isCurrentUser && <small> (You)</small>}
                        </span>
                      </div>
                    </div>
                    <div className="col-points">
                      <strong>{user.points.toLocaleString()}</strong>
                    </div>
                    <div className="col-level">
                      <span className="level-badge">Level {user.level}</span>
                    </div>
                    <div className="col-challenges">
                      {user.completedChallenges}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Remove hardcoded achievements section */}
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
