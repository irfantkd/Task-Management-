import React, { useState, useEffect } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { useGetQuery } from "../service/apiService";

const TaskModal = ({ isOpen, onClose, task, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const {
    data: taskDetailsResponse,
    isLoading: isLoadingTask,
    error: taskError,
  } = useGetQuery(
    {
      path: `/task/get/${task?._id}`,
    },
    {
      skip: !isEditing || !task?._id,
    }
  );

  useEffect(() => {
    if (isEditing && taskDetailsResponse?.data) {
      const taskDetails = taskDetailsResponse.data;
      setFormData({
        title: taskDetails.title || "",
        description: taskDetails.description || "",
        status: taskDetails.status || "pending",
      });
    } else if (!isEditing) {
      setFormData({
        title: "",
        description: "",
        status: "pending",
      });
    }
  }, [isEditing, taskDetailsResponse, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        description: "",
        status: "pending",
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  if (isEditing && isLoadingTask) {
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-xl">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <span className="ml-3 text-slate-300">Loading task details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing && taskError) {
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Error</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center space-x-2 text-red-400 mb-4">
            <AlertCircle className="w-5 h-5" />
            <span>Failed to load task details</span>
          </div>
          <p className="text-slate-300 text-sm mb-4">
            {taskError?.data?.message ||
              taskError?.message ||
              "Unknown error occurred"}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-slate-700 text-slate-200 rounded-lg py-2 hover:bg-slate-600 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter task title..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter task description..."
              rows="4"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              disabled={!formData.title.trim()}
              className="flex-1 bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isEditing ? "Update Task" : "Create Task"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
