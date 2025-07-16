import {
  X,
  Loader2,
  AlertCircle,
  User,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useGetQuery } from "../service/apiService";

const TaskDetailsModal = ({ isOpen, onClose, taskId }) => {
  const {
    data: taskDetailsResponse,
    isLoading: isLoadingTask,
    error: taskError,
  } = useGetQuery(
    {
      path: `/task/get/${taskId}`,
    },
    {
      skip: !isOpen || !taskId,
    }
  );

  if (!isOpen) return null;

  if (isLoadingTask) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl backdrop-blur-sm">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            <span className="ml-4 text-gray-300 text-lg">
              Loading task details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (taskError) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Error</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center space-x-3 text-red-400 mb-4">
            <AlertCircle className="w-6 h-6" />
            <span className="text-lg">Failed to load task details</span>
          </div>
          <p className="text-gray-300 mb-6">
            {taskError?.data?.message ||
              taskError?.message ||
              "Unknown error occurred"}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gray-700 text-gray-300 rounded-lg py-3 hover:bg-gray-600 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const taskDetails = taskDetailsResponse?.data;

  if (!taskDetails) return null;

  const StatusBadge = ({ status }) => {
    const isCompleted = status === "completed";
    return (
      <div
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isCompleted
            ? "bg-green-900/30 text-green-400 border border-green-500/30"
            : "bg-orange-900/30 text-orange-400 border border-orange-500/30"
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-4 h-4 mr-2" />
        ) : (
          <XCircle className="w-4 h-4 mr-2" />
        )}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-6 w-full max-w-3xl backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-700 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-white leading-tight pr-4">
              {taskDetails.title}
            </h3>
            <StatusBadge status={taskDetails.status} />
          </div>

          {taskDetails.description && (
            <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <FileText className="w-5 h-5 text-gray-400 mr-2" />
                <h4 className="text-lg font-medium text-white">Description</h4>
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {taskDetails.description}
              </p>
            </div>
          )}
        </div>

        <div className="gap-6 mb-6">
          <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Calendar className="w-5 h-5 text-gray-400 mr-2" />
              <h4 className="text-lg font-medium text-white">Timeline</h4>
            </div>
            <div className="space-y-3">
              {taskDetails.createdAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-400">Created</p>
                    <p className="text-white">
                      {new Date(taskDetails.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}
              {taskDetails.updatedAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-400">Last Updated</p>
                    <p className="text-white">
                      {new Date(taskDetails.updatedAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
