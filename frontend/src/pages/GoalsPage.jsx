// TODO: Implement goals management page
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import GoalCard from '../components/goals/GoalCard';
import { apiService } from '../services/api';

const GoalForm = ({ onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await apiService.goals.create({
        title: data.title,
        description: data.description,
        target_date: data.target_date || null,
        category: data.category || null,
        difficulty_level: data.difficulty || 'medium',
      });

      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Create goal failed', error);
      alert(error.response?.data?.message || 'Failed to create goal');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="goal-form">
      <div>
        <label>Title</label>
        <input {...register('title', { required: true })} placeholder="e.g., Learn React" />
      </div>

      <div>
        <label>Description</label>
        <textarea {...register('description')} placeholder="Describe your goal" />
      </div>

      <div>
        <label>Target date</label>
        <input type="date" {...register('target_date')} />
      </div>

      <div>
        <label>Category</label>
        <input {...register('category')} placeholder="Programming, Design..." />
      </div>

      <div>
        <label>Difficulty</label>
        <select {...register('difficulty')} defaultValue="medium">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <button type="submit" className="btn-primary">Create Goal</button>
    </form>
  );
};

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);

  const fetchGoals = async () => {
    try {
      const res = await apiService.goals.getAll();
      const data = res.data?.data || res.data;
      setGoals(data || []);
    } catch (error) {
      console.error('Failed to fetch goals', error);
      setGoals([]);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="goals-page">
      <div className="page-header">
        <h1>My Learning Goals</h1>
      </div>

      <div className="goal-create">
        <h2>Create a new goal</h2>
        <GoalForm onSuccess={fetchGoals} />
      </div>

      <div className="goals-grid">
        {goals.length > 0 ? (
          goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))
        ) : (
          <div className="empty-state">
            <p>No goals yet. Create your first learning goal!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;