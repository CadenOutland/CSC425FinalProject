// TODO: Implement goal card component
import React, { useState } from 'react';
import apiService from '../../services/api';

const GoalCard = ({ goal, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${goal.title}"?`)) {
      return;
    }

    try {
      setDeleting(true);
      await apiService.goals.delete(goal.id);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      alert('Failed to delete goal. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="goal-card">
      <div className="goal-header">
        <div className="goal-title-row">
          <h3>{goal?.title || 'Goal Title'}</h3>
          <button 
            className="delete-goal-btn" 
            onClick={handleDelete}
            disabled={deleting}
            title="Delete goal"
            aria-label="Delete goal"
          >
            🗑️
          </button>
        </div>
        <span className="goal-category">{goal?.category || 'Category'}</span>
      </div>
      
      <div className="goal-content">
        <p>{goal?.description || 'Goal description goes here...'}</p>
        
        <div className="goal-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${goal?.progress || 0}%` }}
            ></div>
          </div>
          <span className="progress-text">{goal?.progress || 0}%</span>
        </div>
      </div>

      <div className="goal-footer">
        <span className="goal-difficulty">{goal?.difficulty_level || 'Medium'}</span>
        {goal?.targetDate && (
          <span className="goal-date">Due: {goal.targetDate}</span>
        )}
      </div>
    </div>
  );
};

export default GoalCard;