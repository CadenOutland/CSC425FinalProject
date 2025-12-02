import { Link } from "react-router-dom";

const ErrorPage = () => {
  const resetError = () => window.location.reload();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-3xl w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-4xl font-bold text-gray-800">
            Something Went Wrong
          </h1>
          <p className="text-gray-600 mt-2">
            An unexpected error occurred. Our team has been notified.
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={resetError}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium shadow hover:bg-purple-700"
          >
            Try Again
          </button>

          <Link
            to="/"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium shadow hover:bg-gray-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

