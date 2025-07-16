const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
      <p className="text-gray-400 text-lg">Loading your tasks...</p>
    </div>
  </div>
);

export default LoadingSpinner;
