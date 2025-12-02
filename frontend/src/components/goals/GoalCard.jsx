
export default function GoalCard({ goal }) {
  const progress = goal?.progress || 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {goal?.title || "Goal Title"}
        </h3>
        <span className="text-sm px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
          {goal?.category || "General"}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4">
        {goal?.description || "Goal description goes here..."}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm font-medium text-gray-700 mt-1">
          {progress}% complete
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span className="font-medium">
          Difficulty:{" "}
          <span className="text-gray-800">{goal?.difficulty || "Medium"}</span>
        </span>
        {goal?.targetDate && (
          <span className="font-medium text-gray-700">
            Due: {goal.targetDate}
          </span>
        )}
      </div>
    </div>
  );
}

