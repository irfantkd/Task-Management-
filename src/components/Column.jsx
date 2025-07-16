import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const Column = ({
  title,
  status,
  icon: Icon,
  tasks,
  gradient,
  onEditTask,
  onDeleteTask,
  onViewDetails,
}) => (
  <div className="flex-1 min-w-0">
    <div className={`bg-gradient-to-r ${gradient} p-4 rounded-t-xl shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-white" />
          <h2 className="text-white font-semibold">{title}</h2>
          <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
      </div>
    </div>

    <Droppable droppableId={status} type="TASK" isDropDisabled={false}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`bg-gray-900/30 border-l border-r border-b border-gray-700 rounded-b-xl p-4 min-h-[70vh] backdrop-blur-sm transition-colors duration-200 ${
            snapshot.isDraggingOver ? "bg-gray-800/40" : ""
          }`}
        >
          {tasks.map((task, index) => (
            <TaskCard
              key={task._id}
              task={task}
              index={index}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onViewDetails={onViewDetails}
            />
          ))}
          {provided.placeholder}

          {tasks.length === 0 && (
            <div className="text-center py-16">
              <Icon className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500 text-lg">
                No tasks in {title.toLowerCase()}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                {status === "pending"
                  ? "Create your first task to get started"
                  : "Complete some tasks to see them here"}
              </p>
            </div>
          )}
        </div>
      )}
    </Droppable>
  </div>
);

export default Column;
