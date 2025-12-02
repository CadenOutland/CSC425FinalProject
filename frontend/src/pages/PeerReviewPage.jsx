import { useEffect, useState } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

const PeerReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("others");
  const { user } = useAuth();

  useEffect(() => {
    const mockReviews = [
      {
        id: 1,
        title: "React Performance Optimization",
        author: "Sarah Kim",
        avatar: "🎨",
        snippet: "function useOptimized() { ... }",
        category: "React",
        difficulty: "Intermediate",
        reviews: 2,
        maxReviews: 3,
      },
      {
        id: 2,
        title: "Sorting Algorithm Challenge",
        author: "Mike Chen",
        avatar: "⚡",
        snippet: "function mergeSort(arr) { ... }",
        category: "Algorithms",
        difficulty: "Advanced",
        reviews: 1,
        maxReviews: 3,
      },
    ];

    const mockMySubs = [
      {
        id: 1,
        title: "JavaScript API Integration",
        category: "JavaScript",
        difficulty: "Intermediate",
        reviews: 2,
        maxReviews: 3,
        status: "Under Review",
      },
    ];

    setTimeout(() => {
      setReviews(mockReviews);
      setMySubmissions(mockMySubs);
      setLoading(false);
    }, 800);
  }, []);

  const difficultyColor = {
    Beginner: "bg-green-200",
    Intermediate: "bg-yellow-200",
    Advanced: "bg-red-200",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Peer Review</h1>
        <p className="text-gray-500 mt-2">
          Collaborate with peers and grow together
        </p>
      </header>

      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={() => setActiveTab("others")}
          className={`px-6 py-3 rounded-lg shadow font-medium ${
            activeTab === "others"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Review Others
        </button>

        <button
          onClick={() => setActiveTab("mine")}
          className={`px-6 py-3 rounded-lg shadow font-medium ${
            activeTab === "mine"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          My Submissions
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : activeTab === "others" ? (
        <div className="mt-10 grid gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold">{r.title}</h3>
                <p className="text-gray-500">{r.author}</p>
                <p className="text-gray-800 bg-gray-100 p-2 rounded-lg mt-3 text-sm">
                  {r.snippet}
                </p>

                <div className="flex gap-3 mt-3 items-center">
                  <span
                    className={`px-3 py-1 text-sm rounded-lg ${difficultyColor[r.difficulty]}`}
                  >
                    {r.difficulty}
                  </span>
                  <span className="text-gray-500">{r.category}</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-gray-500 mb-3">
                  {r.reviews}/{r.maxReviews} reviews
                </p>
                <button className="px-5 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700">
                  Review Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-6">
          {mySubmissions.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="text-gray-500">{s.category}</p>

                <span
                  className={`px-3 py-1 text-sm rounded-lg ${difficultyColor[s.difficulty]}`}
                >
                  {s.difficulty}
                </span>
              </div>

              <div className="text-right">
                <p className="text-gray-600">
                  {s.reviews}/{s.maxReviews} reviews
                </p>
                <p className="text-purple-600 font-medium">{s.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PeerReviewPage;

