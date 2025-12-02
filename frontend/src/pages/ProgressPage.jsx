import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ProgressPage = () => {
  const [loading, setLoading] = useState(true);

  const progressData = [
    { day: "Mon", points: 120 },
    { day: "Tue", points: 180 },
    { day: "Wed", points: 250 },
    { day: "Thu", points: 210 },
    { day: "Fri", points: 300 },
    { day: "Sat", points: 320 },
    { day: "Sun", points: 350 },
  ];

  const stats = [
    {
      label: "Weekly Points",
      value: "1,430",
      change: "+14%",
      color: "text-purple-600",
    },
    {
      label: "Challenges Completed",
      value: "8",
      change: "+3",
      color: "text-purple-600",
    },
    {
      label: "Daily Streak",
      value: "12",
      change: "+1",
      color: "text-purple-600",
    },
    {
      label: "Total XP",
      value: "4,680",
      change: "+260",
      color: "text-purple-600",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading Progress...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-4xl font-bold text-gray-800 text-center">
        Your Progress
      </h1>
      <p className="text-center text-gray-500 mt-2">
        Track your growth and performance over time
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-6 text-center border-t-4 border-purple-500"
          >
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-3xl font-bold mt-2">{s.value}</p>
            <p className={`${s.color} font-semibold mt-1`}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-14 bg-white p-10 shadow rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Weekly Performance
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="points"
              stroke="#9333ea"
              strokeWidth={3}
              dot={{ r: 4, fill: "#9333ea" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Achievements */}
      <div className="mt-14 bg-white p-10 shadow rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Achievements</h2>

        <ul className="space-y-4">
          <li className="bg-gray-100 p-4 rounded-lg flex justify-between">
            <span>🔥 7-Day Learning Streak</span>
            <span className="text-purple-600 font-semibold">Unlocked</span>
          </li>

          <li className="bg-gray-100 p-4 rounded-lg flex justify-between">
            <span>🏆 Completed 10 Coding Challenges</span>
            <span className="text-purple-600 font-semibold">Unlocked</span>
          </li>

          <li className="bg-gray-100 p-4 rounded-lg flex justify-between">
            <span>📈 First Weekly XP Goal Achieved</span>
            <span className="text-purple-600 font-semibold">Unlocked</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProgressPage;

