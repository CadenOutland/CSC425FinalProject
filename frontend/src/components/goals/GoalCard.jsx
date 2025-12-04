// TODO: Implement goal card component
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import apiService from '../../services/api';
import './GoalCard.css';

const GoalCard = ({ goal, onDelete, onUpdate }) => {
  const [deleting, setDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      title: goal?.title || '',
      description: goal?.description || '',
      target_date: goal?.target_date ? goal.target_date.split('T')[0] : '',
      category: goal?.category || '',
      difficulty_level: goal?.difficulty_level || 'medium',
    }
  });
  const [updating, setUpdating] = useState(false);

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

  const handleEditSubmit = async (data) => {
    try {
      setUpdating(true);
      await apiService.goals.update(goal.id, {
        title: data.title,
        description: data.description,
        target_date: data.target_date || null,
        category: data.category || null,
        difficulty_level: data.difficulty_level || 'medium',
      });
      
      setIsEditModalOpen(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update goal:', error);
      alert(error.response?.data?.message || 'Failed to update goal. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="goal-card">
        <div className="goal-header">
          <div className="goal-title-row">
            <h3>{goal?.title || 'Goal Title'}</h3>
            <div className="goal-actions">
              <button 
                className="edit-goal-btn" 
                onClick={() => setIsEditModalOpen(true)}
                title="Edit goal"
                aria-label="Edit goal"
              >
                ⚙️
              </button>
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
          {goal?.target_date && (
            <span className="goal-date">Due: {new Date(goal.target_date).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <div className="edit-goal-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="edit-goal-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Goal</h2>
              <button 
                className="modal-close-btn" 
                onClick={() => setIsEditModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(handleEditSubmit)} className="edit-goal-form">
              <div className="form-group">
                <label>Title</label>
                <input 
                  {...register('title', { required: true })} 
                  placeholder="e.g., Learn React"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  {...register('description')} 
                  placeholder="Describe your goal"
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Target Date</label>
                <input 
                  type="date" 
                  {...register('target_date')}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input 
                  {...register('category')} 
                  placeholder="Programming, Design..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select {...register('difficulty_level')} className="form-select">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GoalCard;