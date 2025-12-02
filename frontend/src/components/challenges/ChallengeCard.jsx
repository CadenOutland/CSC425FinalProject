
export default function ChallengeCard({ challenge }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition border border-gray-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-800">
          {challenge?.title || "Challenge Title"}
        </h3>
        <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
          {challenge?.difficulty || "Medium"}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4">
        {challenge?.description || "Challenge description goes here..."}
      </p>

      {/* Estimated Time */}
      {challenge?.estimatedTime && (
        <div className="mb-3 text-sm text-gray-700">
          ⏱ <span className="font-medium">{challenge.estimatedTime}</span> min
        </div>
      )}

      {/* Tags */}
      {challenge?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {challenge.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Points */}
      <p className="mb-4 font-medium text-purple-600">
        +{challenge?.points || 10} points
      </p>

      {/* Action */}
      <button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition">
        Start Challenge
      </button>
    </div>
  );
}

