import ToggleSwitch from "../ui/ToggleSwitch";
import { Eye, Edit, Trash2 } from "lucide-react";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onViewDetails,
  onToggleStatus,
}) => (
  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 sm:p-6 hover:bg-gray-800/80 transition-all duration-200 backdrop-blur-sm group">
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
          <h3
            className="text-white font-semibold text-lg cursor-pointer hover:text-purple-400 transition-colors duration-200 truncate"
            onClick={() => onViewDetails(task._id)}
          >
            {task.title}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
              task.status === "completed"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-orange-100 text-orange-800 border border-orange-200"
            }`}
          >
            {task.status === "completed" ? "Completed" : "Pending"}
          </span>
        </div>

        {task.description && (
          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* User Info */}
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">
              {task.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-gray-400 text-sm block truncate">
              {task.user?.name || "Unknown User"}
            </span>
            <p className="text-xs text-gray-500">
              Created:{" "}
              {new Date(task.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Toggle Switch */}
        <div className="order-2 sm:order-1">
          <ToggleSwitch
            checked={task.status === "completed"}
            onChange={() => onToggleStatus(task)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 order-1 sm:order-2">
          <button
            onClick={() => onViewDetails(task._id)}
            className="text-gray-400 hover:text-green-400 p-2 rounded-lg transition-colors duration-200 hover:bg-gray-700/50"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-400 p-2 rounded-lg transition-colors duration-200 hover:bg-gray-700/50"
            title="Edit Task"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-400 hover:text-red-400 p-2 rounded-lg transition-colors duration-200 hover:bg-gray-700/50"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default TaskCard;
