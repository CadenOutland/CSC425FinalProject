import { useEffect, useState } from "react";
import { apiService } from "../../services/api";

export default function DashboardOverview() {
  const [overview, setOverview] = useState({
    percentage: 0,
    completed: 0,
    totalChallenges: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiService.progress.getStats();
        const data = res.data?.data || res.data;
        setOverview(data || overview);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text">
          Welcome Back to SkillWise 🎓
        </h1>
        <p className="text-gray-600 mt-2">
          Track your achievements and skill growth
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card: Goals */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
          <h3 className="text-gray-700 font-medium">Goals Completed</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {overview.goalsCompleted ?? 0}
          </p>
        </div>

        {/* Card: Challenges */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
          <h3 className="text-gray-700 font-medium">Challenges Completed</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {overview.challengesCompleted ?? 0}
          </p>
        </div>

        {/* Card: Total Points */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
          <h3 className="text-gray-700 font-medium">Total Points</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {overview.totalPoints ?? 0}
          </p>
        </div>

        {/* Card: Overall Progress */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
          <h3 className="text-gray-700 font-medium">Overall Progress</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">
            {overview.percentage ?? 0}%
          </p>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your Learning Progress
        </h2>

        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className="h-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
            style={{ width: `${overview.percentage || 0}%` }}
          ></div>
        </div>

        <p className="text-gray-700 font-medium mt-3">
          {overview.percentage || 0}% Completed
        </p>
      </div>
    </div>
  );
}

