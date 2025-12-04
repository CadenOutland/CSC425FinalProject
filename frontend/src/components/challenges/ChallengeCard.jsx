// TODO: Implement challenge card component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import './ChallengeCard.css';

const ChallengeCard = ({ challenge, onDelete }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (
      !window.confirm(`Are you sure you want to delete "${challenge.title}"?`)
    ) {
      return;
    }

    try {
      setDeleting(true);
      await apiService.challenges.delete(challenge.id);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Failed to delete challenge:', error);
      alert('Failed to delete challenge. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleStartChallenge = (e) => {
    e.preventDefault();
    console.log('Starting challenge:', challenge?.id);
    // Navigate to challenge details or submission page
    if (challenge?.id) {
      navigate(`/challenges/${challenge.id}`, { state: { challenge } });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="challenge-card">
      <div
        className="challenge-card-header"
        style={{
          background: `linear-gradient(135deg, ${getDifficultyColor(
            challenge?.difficulty
          )} 0%, ${getDifficultyColor(challenge?.difficulty)}99 100%)`,
        }}
      >
        <div className="challenge-title-row">
          <h3>{challenge?.title || 'Challenge Title'}</h3>
          <button
            className="delete-challenge-btn"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete challenge"
            aria-label="Delete challenge"
          >
            🗑️
          </button>
        </div>
        <div className="challenge-meta">
          <span className="difficulty-badge">
            {challenge?.difficulty || 'Medium'}
          </span>
          <span className="points-badge">+{challenge?.points || 10} pts</span>
        </div>
      </div>

      <div className="challenge-card-body">
        <p>{challenge?.description || 'Challenge description goes here...'}</p>

        {challenge?.estimatedTime && (
          <div className="estimated-time">
            <span>⏱️ {challenge.estimatedTime} min</span>
          </div>
        )}

        {challenge?.tags && challenge.tags.length > 0 && (
          <div className="challenge-tags">
            {challenge.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="challenge-card-footer">
        <button className="btn-primary" onClick={handleStartChallenge}>
          🚀 Start Challenge
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;
