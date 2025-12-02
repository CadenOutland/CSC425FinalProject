import { useEffect, useState } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

const LeaderboardPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const sample = [
      { id: 1, name: "Alex Johnson", points: 2450, rank: 1, avatar: "🧑‍💻" },
      { id: 2, name: "Sarah Kim", points: 2380, rank: 2, avatar: "🎨" },
      { id: 3, name: "Mike Chen", points: 2290, rank: 3, avatar: "🔬" },
      {
        id: 4,
        name: user?.firstName + " " + user?.lastName || "You",
        points: 1850,
        rank: 5,
        avatar: "👤",
        isCurrent: true,
      },
    ];

    setTimeout(() => {
      setData(sample);
      setLoading(false);
    }, 800);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header>
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Leaderboard
        </h1>
        <p className="text-center text-gray-500 mt-2">
          See where you stand among other learners
        </p>
      </header>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-10 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Top Performers</h2>

          {data.map((user) => (
            <div
              key={user.id}
              className={`flex justify-between items-center p-4 border-b last:border-none rounded-lg ${
                user.isCurrent ? "bg-purple-100" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{user.avatar}</span>
                <div>
                  <h3 className="font-bold text-gray-800">{user.name}</h3>
                  <p className="text-gray-500">{user.points} points</p>
                </div>
              </div>
              <div className="text-lg font-bold text-purple-600">
                #{user.rank}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;

