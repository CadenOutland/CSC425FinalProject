import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalCard from '../components/goals/GoalCard';
import { apiService } from '../services/api';

const GoalsPage = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await apiService.goals.getAll();
      setGoals(response.data.goals);
      setError(null);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load goals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="goals-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            My Learning Goals
          </h1>
          <button
            onClick={() => navigate('/goals/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Goal
          </button>
        </div>

        <div className="mb-6">
          <select
            onChange={(e) => console.log('Filter:', e.target.value)}
            className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="language">Language</option>
            <option value="mathematics">Mathematics</option>
            <option value="science">Science</option>
            <option value="other">Other</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading goals...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchGoals}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Try Again
            </button>
          </div>
        ) : goals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No goals yet. Start your learning journey!
            </p>
            <button
              onClick={() => navigate('/goals/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;
