import React, { useState, useEffect } from 'react';
import ProgressBar from '../components/progress/ProgressBar';
import ChallengeCard from '../components/challenges/ChallengeCard';
import { useChallenges } from '../hooks/useChallenges';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { challenges, loading, error } = useChallenges();
  const [completedChallenges, setCompletedChallenges] = useState([]);

  useEffect(() => {
    if (challenges) {
      const completed = challenges.filter(
        (challenge) => challenge.status === 'completed'
      );
      setCompletedChallenges(completed);
    }
  }, [challenges]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading dashboard: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Track your progress and continue your learning journey.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Your Progress
        </h2>
        <ProgressBar
          totalChallenges={challenges?.length || 0}
          completedChallenges={completedChallenges.length}
        />
      </div>

      {/* Active Challenges */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Active Challenges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges
            ?.filter((challenge) => challenge.status === 'in-progress')
            .map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedChallenges.slice(0, 3).map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
