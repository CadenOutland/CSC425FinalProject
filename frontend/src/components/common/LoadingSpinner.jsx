
export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
      <p className="mt-3 text-gray-600 font-medium">{message}</p>
    </div>
  );
}

