import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };
  return colors[difficulty?.toLowerCase()] || colors.medium;
};

const getStatusColor = (status) => {
  const colors = {
    'not-started': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };
  return colors[status] || colors['not-started'];
};

const ChallengeCard = ({ challenge, onClick }) => {
  const navigate = useNavigate();

  const handleStartChallenge = (e) => {
    e.stopPropagation();
    navigate(`/challenges/${challenge.id}/start`);
  };

  return (
    <div
      onClick={() => onClick?.(challenge)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {challenge?.title || 'Challenge Title'}
          </h3>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                challenge?.difficulty
              )}`}
            >
              {challenge?.difficulty || 'Medium'}
            </span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
              +{challenge?.points || 10} pts
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {challenge?.description || 'Challenge description goes here...'}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-2 mb-4">
          {challenge?.estimatedTime && (
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {challenge.estimatedTime} min
            </span>
          )}

          {challenge?.category && (
            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
              {challenge.category}
            </span>
          )}

          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              challenge?.status
            )}`}
          >
            {challenge?.status || 'Not Started'}
          </span>
        </div>

        {/* Tags */}
        {challenge?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {challenge.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {challenge?.dueDate && (
              <span>
                Due {new Date(challenge.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
          <button
            onClick={handleStartChallenge}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors duration-150"
          >
            {challenge?.status === 'completed'
              ? 'View Solution'
              : 'Start Challenge'}
          </button>
        </div>
      </div>
    </div>
  );
};

ChallengeCard.propTypes = {
  challenge: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    description: PropTypes.string,
    difficulty: PropTypes.oneOf(['easy', 'medium', 'hard']),
    points: PropTypes.number,
    estimatedTime: PropTypes.number,
    category: PropTypes.string,
    status: PropTypes.oneOf([
      'not-started',
      'in-progress',
      'completed',
      'failed',
    ]),
    tags: PropTypes.arrayOf(PropTypes.string),
    dueDate: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

ChallengeCard.defaultProps = {
  challenge: {
    title: 'Challenge Title',
    description: 'Challenge description goes here...',
    difficulty: 'medium',
    points: 10,
    status: 'not-started',
  },
  onClick: undefined,
};

export default ChallengeCard;
