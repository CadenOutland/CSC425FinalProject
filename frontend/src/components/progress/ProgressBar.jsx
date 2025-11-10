import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ProgressBar = ({
  totalChallenges,
  completedChallenges,
  height = 100,
}) => {
  const completionPercentage =
    totalChallenges > 0
      ? Math.round((completedChallenges / totalChallenges) * 100)
      : 0;

  const data = [
    {
      name: 'Progress',
      completed: completedChallenges,
      remaining: totalChallenges - completedChallenges,
    },
  ];

  return (
    <div className="w-full">
      {/* Simple Progress Bar for Mobile */}
      <div className="md:hidden w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      {/* Recharts Progress Bar for Desktop */}
      <div className="hidden md:block h-24">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            stackOffset="expand"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(value) => `${Math.round(value * 100)}%`}
              domain={[0, 1]}
            />
            <YAxis type="category" hide />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'completed') {
                  return [`${value} Completed`, 'Completed Challenges'];
                }
                return [`${value} Remaining`, 'Remaining Challenges'];
              }}
            />
            <Bar
              dataKey="completed"
              stackId="a"
              fill="#4F46E5"
              radius={[4, 0, 0, 4]}
            />
            <Bar
              dataKey="remaining"
              stackId="a"
              fill="#E5E7EB"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Progress Text */}
      <div className="text-center mt-2">
        <p className="text-sm text-gray-600">
          {completedChallenges} of {totalChallenges} challenges completed (
          {completionPercentage}%)
        </p>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  totalChallenges: PropTypes.number.isRequired,
  completedChallenges: PropTypes.number.isRequired,
  height: PropTypes.number,
};

export default ProgressBar;
