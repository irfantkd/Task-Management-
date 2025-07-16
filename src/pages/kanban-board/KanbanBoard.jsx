import { useState, useEffect, useMemo } from "react";
import { DragDropContext } from "@adaptabletools/react-beautiful-dnd";
import { Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import {
  useGetQuery,
  usePostMutation,
  usePutMutation,
  useDeleteMutation,
} from "../../service/apiService";
import TaskModal from "../../components/TaskModal";
import Column from "../../components/Column";
import SearchAndFilter from "../../components/SearchAndFilter";
import Statistics from "../../components/Statistics";
import TaskDetailsModal from "../../components/TaskDetailsModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
  </div>
);

// Error Component
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

const KanbanBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTaskId, setViewingTaskId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [filters, setFilters] = useState({});

  // API queries and mutations
  const {
    data: tasksResponse,
    isLoading: loading,
    error: fetchError,
    refetch: refetchTasks,
  } = useGetQuery({
    path: "/task/get",
    params: filters,
  });

  const [createTaskMutation, { isLoading: isCreating }] = usePostMutation();
  const [updateTaskMutation, { isLoading: isUpdating }] = usePutMutation();
  const [deleteTaskMutation, { isLoading: isDeleting }] = useDeleteMutation();

  // Extract tasks from response
  const [tasks, setTasks] = useState([]);

  const tasksData = useMemo(() => {
    if (tasksResponse?.data) {
      return Array.isArray(tasksResponse.data)
        ? tasksResponse.data
        : [tasksResponse.data];
    }
    return [];
  }, [tasksResponse]);

  // Update tasks state when API data changes
  useEffect(() => {
    setTasks(tasksData);
  }, [tasksData]);

  // Update filters when search or filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newFilters = {};
      if (searchTerm) newFilters.search = searchTerm;
      if (filterStatus !== "all") newFilters.status = filterStatus;
      setFilters(newFilters);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterStatus]);

  // Filter tasks for display
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !searchTerm ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || task.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchTerm, filterStatus]);

  const pendingTasks = useMemo(
    () => filteredTasks.filter((task) => task.status === "pending"),
    [filteredTasks]
  );

  const completedTasks = useMemo(
    () => filteredTasks.filter((task) => task.status === "completed"),
    [filteredTasks]
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((task) => task.status === "pending").length;
    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    return { total, pending, completed };
  }, [tasks]);

  // Error handling
  const error = fetchError?.data?.message || fetchError?.message || null;

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleOpenDetailsModal = (taskId) => {
    setViewingTaskId(taskId);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setViewingTaskId(null);
  };

  const handleOpenDeleteModal = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleSubmitTask = async (formData) => {
    try {
      if (editingTask) {
        // Update existing task
        await updateTaskMutation({
          path: `/task/update/${editingTask._id}`,
          body: formData,
        }).unwrap();
      } else {
        // Create new task
        await createTaskMutation({
          path: "/task/create",
          body: formData,
        }).unwrap();
      }

      // Refetch tasks to get updated data
      refetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save task:", error);
      // You might want to show a toast notification here
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (taskId) {
      // Open the delete modal instead of browser alert
      handleOpenDeleteModal(taskId);
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTaskMutation({
        path: `/task/delete/${taskToDelete._id}`,
      }).unwrap();

      refetchTasks();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleDragEnd = async (result) => {
    console.log("Drag result:", result);

    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // If dropped in the same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskId = draggableId;
    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;

    // Get the task being dragged
    const draggedTask = tasks.find((task) => task._id === taskId);
    if (!draggedTask) {
      console.error("Task not found:", taskId);
      return;
    }

    let newTasks = [...tasks];

    if (sourceStatus === destinationStatus) {
      const columnTasks = tasks.filter((task) => task.status === sourceStatus);
      const [movedTask] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, movedTask);

      newTasks = newTasks.map((task) => {
        if (task.status === sourceStatus) {
          const index = columnTasks.findIndex((t) => t._id === task._id);
          return index !== -1 ? columnTasks[index] : task;
        }
        return task;
      });
    } else {
      newTasks = newTasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              status: destinationStatus,
              updatedAt: new Date().toISOString(),
            }
          : task
      );
    }

    setTasks(newTasks);

    try {
      await updateTaskMutation({
        path: `/task/update/${taskId}`,
        body: {
          ...draggedTask,
          status: destinationStatus,
        },
      }).unwrap();

      refetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
      refetchTasks();
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Task Management
              </h1>
              <p className="text-gray-300 text-md">
                Organize, track, and complete your tasks efficiently
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Statistics
                totalTasks={stats.total}
                pendingTasks={stats.pending}
                completedTasks={stats.completed}
              />

              <button
                onClick={() => handleOpenModal()}
                disabled={isCreating}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                <span>{isCreating ? "Creating..." : "Add Task"}</span>
              </button>
            </div>
          </div>
        </div>

        {error && <ErrorMessage error={error} onRetry={refetchTasks} />}

        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {isUpdating && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              <span className="text-white">Updating task...</span>
            </div>
          </div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Column
              title="Pending Tasks"
              status="pending"
              icon={Clock}
              tasks={pendingTasks}
              gradient="from-orange-600 to-red-600"
              onEditTask={handleOpenModal}
              onDeleteTask={handleDeleteTask}
              onViewDetails={handleOpenDetailsModal}
            />
            <Column
              title="Completed Tasks"
              status="completed"
              icon={CheckCircle}
              tasks={completedTasks}
              gradient="bg-green-600"
              onEditTask={handleOpenModal}
              onDeleteTask={handleDeleteTask}
              onViewDetails={handleOpenDetailsModal}
            />
          </div>
        </DragDropContext>

        {/* Task Modal */}
        <TaskModal
          isOpen={showModal}
          onClose={handleCloseModal}
          task={editingTask}
          onSubmit={handleSubmitTask}
          isEditing={!!editingTask}
        />

        {/* Task Details Modal */}
        <TaskDetailsModal
          isOpen={showDetailsModal}
          onClose={handleCloseDetailsModal}
          taskId={viewingTaskId}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          taskTitle={taskToDelete?.title}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default KanbanBoard;
