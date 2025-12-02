import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white p-12 rounded-2xl shadow-xl max-w-2xl w-full text-center">
        <div className="text-7xl mb-6">🤖</div>

        <h1 className="text-5xl font-bold text-gray-800">404</h1>
        <p className="text-gray-500 text-lg mt-2">Page Not Found</p>

        <p className="text-gray-600 mt-4">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
          >
            Go Home
          </Link>

          <Link
            to="/dashboard"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Helpful Links
          </h3>
          <ul className="grid gap-2 text-purple-700">
            <li>
              <Link to="/challenges" className="hover:underline">
                Browse Challenges
              </Link>
            </li>
            <li>
              <Link to="/goals" className="hover:underline">
                View Your Goals
              </Link>
            </li>
            <li>
              <Link to="/progress" className="hover:underline">
                Track Progress
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="hover:underline">
                Leaderboard
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-10 text-gray-400">"Still searching for that page..."</div>
      </div>
    </div>
  );
};

export default NotFoundPage;
