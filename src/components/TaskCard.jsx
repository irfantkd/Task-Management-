import { Draggable } from "react-beautiful-dnd";
import { Edit, Trash2, Eye } from "lucide-react";

const TaskCard = ({ task, index, onEdit, onDelete, onViewDetails }) => (
  <Draggable draggableId={task._id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-gray-800/60 border border-gray-700 rounded-xl p-4 mb-4 cursor-move hover:bg-gray-800/80 transition-all duration-200 transform hover:scale-[1.02] backdrop-blur-sm group ${
          snapshot.isDragging ? "shadow-xl rotate-2" : ""
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <h3
            className="text-white font-semibold text-sm leading-tight pr-2 line-clamp-2 cursor-pointer hover:text-purple-400 transition-colors duration-200"
            onClick={() => onViewDetails(task._id)}
          >
            {task.title}
          </h3>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onViewDetails(task._id)}
              className="text-gray-400 hover:text-green-400 p-1 rounded transition-colors duration-200"
              title="View Details"
            >
              <Eye className="w-3 h-3" />
            </button>
            <button
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-blue-400 p-1 rounded transition-colors duration-200"
              title="Edit Task"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors duration-200"
              title="Delete Task"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-gray-300 text-xs mb-4 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {task.user?.name?.charAt(0)?.toUpperCase() ||
                  task.user?.avatar ||
                  "U"}
              </span>
            </div>
            <span className="text-gray-400 text-xs">
              {task.user?.name || "Unknown User"}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(task.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    )}
  </Draggable>
);

export default TaskCard;
