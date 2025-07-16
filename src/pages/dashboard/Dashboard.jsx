import { useState, useEffect, useMemo } from "react";
import { Plus, Clock, AlertCircle } from "lucide-react";
import {
  useGetQuery,
  usePostMutation,
  usePutMutation,
  useDeleteMutation,
} from "../../service/apiService";
import TaskModal from "../../components/TaskModal";
import TaskDetailsModal from "../../components/TaskDetailsModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Statistics from "../../components/Statistics";
import SearchAndFilter from "../../components/SearchAndFilter";
import TaskCard from "../../components/TaskCard";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
      <p className="text-gray-400 text-lg">Loading your tasks...</p>
    </div>
  </div>
);

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

const TaskManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTaskId, setViewingTaskId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [filters, setFilters] = useState({});

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

  const [tasks, setTasks] = useState([]);

  const tasksData = useMemo(() => {
    if (tasksResponse?.data) {
      return Array.isArray(tasksResponse.data)
        ? tasksResponse.data
        : [tasksResponse.data];
    }
    return [];
  }, [tasksResponse]);

  useEffect(() => {
    if (tasksData.length > 0 || (tasksResponse && !loading)) {
      setTasks(tasksData);
    }
  }, [tasksData, tasksResponse, loading]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newFilters = {};
      if (searchTerm) newFilters.search = searchTerm;
      if (filterStatus !== "all") newFilters.status = filterStatus;
      setFilters(newFilters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterStatus]);

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

  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((task) => task.status === "pending").length;
    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    return { total, pending, completed };
  }, [tasks]);

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
        await updateTaskMutation({
          path: `/task/update/${editingTask._id}`,
          body: formData,
        }).unwrap();
      } else {
        await createTaskMutation({
          path: "/task/create",
          body: formData,
        }).unwrap();
      }
      refetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (taskId) {
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

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id ? { ...t, status: newStatus } : t
        )
      );

      await updateTaskMutation({
        path: `/task/update/${task._id}`,
        body: { ...task, status: newStatus },
      }).unwrap();

      refetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id ? { ...t, status: task.status } : t
        )
      );
    }
  };

  if (loading) {
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
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                Task Management System
              </h1>
              <p className="text-gray-300 text-base sm:text-md">
                Create, organize, and track your tasks efficiently
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="w-full sm:w-auto flex-1">
                <Statistics
                  totalTasks={stats.total}
                  pendingTasks={stats.pending}
                  completedTasks={stats.completed}
                />
              </div>

              <div className="w-full sm:w-auto">
                <button
                  onClick={() => handleOpenModal()}
                  disabled={isCreating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" />
                  <span>{isCreating ? "Creating..." : "Add New Task"}</span>
                </button>
              </div>
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

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 && !loading ? (
            <div className="text-center py-12 sm:py-16">
              <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500 text-lg sm:text-xl mb-2">
                No tasks found
              </p>
              <p className="text-gray-600 text-sm">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first task to get started"}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleOpenModal}
                onDelete={handleDeleteTask}
                onViewDetails={handleOpenDetailsModal}
                onToggleStatus={handleToggleStatus}
              />
            ))
          )}
        </div>

        <TaskModal
          isOpen={showModal}
          onClose={handleCloseModal}
          task={editingTask}
          onSubmit={handleSubmitTask}
          isEditing={!!editingTask}
        />

        <TaskDetailsModal
          isOpen={showDetailsModal}
          onClose={handleCloseDetailsModal}
          taskId={viewingTaskId}
        />

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

export default TaskManagement;
