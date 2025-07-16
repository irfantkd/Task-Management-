import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ error, onRetry }) => (
  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
    <div className="flex items-center space-x-2">
      <AlertCircle className="w-5 h-5 text-red-400" />
      <span className="text-red-300 font-medium">Error</span>
    </div>
    <p className="text-red-200 mt-2">{error}</p>
    <button
      onClick={onRetry}
      className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
    >
      Try Again
    </button>
  </div>
);

export default ErrorMessage;
