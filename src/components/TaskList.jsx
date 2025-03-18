import { useState, useRef, useEffect } from "react";
import { useTasks, useTaskMutations } from "../hooks/useTasks";

import Button from "./Button";

export default function TaskList() {
  const { tasks, isLoading, isError, error, refetch } = useTasks();
  const {
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isDeleting,
    isUpdating,
  } = useTaskMutations();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  // Function to format dates as relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return null; // Don't show badge for recent tasks
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}w old`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}m old`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years}y old`;
    }
  };

  // Auto-focus on the input field when the form becomes visible
  useEffect(() => {
    if (showAddForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddForm]);

  // Add click outside handler for the add form
  useEffect(() => {
    if (showAddForm) {
      const handleClickOutside = (e) => {
        if (
          inputRef.current &&
          !inputRef.current.contains(e.target) &&
          !e.target.closest("button")
        ) {
          setShowAddForm(false);
          setNewTaskDescription("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showAddForm]);

  // Auto-focus on the edit input when editing starts and handle clicking outside
  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
      // Select all text in the input
      editInputRef.current.select();

      // Add click outside handler
      const handleClickOutside = (e) => {
        if (editInputRef.current && !editInputRef.current.contains(e.target)) {
          saveEditedTask();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [editingTaskId]);

  // Add keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 'T' key to show the form (when not already showing)
      if (
        (e.key === "t" || e.key === "T") &&
        !(e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") &&
        !showAddForm &&
        !editingTaskId
      ) {
        e.preventDefault();
        setShowAddForm(true);
      }

      // Escape key to cancel the form (when showing) or editing
      if (e.key === "Escape") {
        if (showAddForm) {
          setShowAddForm(false);
          setNewTaskDescription("");
        }
        if (editingTaskId) {
          setEditingTaskId(null);
          setEditingText("");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAddForm, editingTaskId]);

  const handleToggleTask = (task) => {
    updateTask({
      taskId: task.id,
      taskData: { completed: !task.completed },
    });
  };

  const handleDeleteTask = (taskId) => {
    // Pass the ID directly to the deleteTask function
    deleteTask(taskId);
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.description);
  };

  const saveEditedTask = () => {
    if (editingTaskId && editingText.trim()) {
      updateTask({
        taskId: editingTaskId,
        taskData: { description: editingText.trim() },
      });
      setEditingTaskId(null);
      setEditingText("");
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEditedTask();
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskDescription.trim()) return;

    // Optimistically update the form state before the API call completes
    setNewTaskDescription("");
    setShowAddForm(false);

    createTask({
      description: newTaskDescription.trim(),
      completed: false,
    });
  };

  return (
    <div>
      {/* Show when waiting for user authentication */}
      {!isLoading && tasks.length === 0 && !isError && !showAddForm && (
        <div>Ready to load tasks...</div>
      )}

      {/* Show during loading */}
      {isLoading && <div className="loading-spinner">Loading tasks...</div>}

      {/* Show on error */}
      {isError && (
        <div className="error-message">
          <p>Error: {error?.message || "Failed to load tasks"}</p>
          <button onClick={refetch}>Try Again</button>
        </div>
      )}

      {/* Show when tasks are loaded successfully or when adding a new task */}
      {!isLoading && !isError && (tasks.length > 0 || showAddForm) && (
        <div className="rounded-md">
          {/* <div className="flex flex-row items-center justify-between">
            <h2 className="mb-3 text-xl font-medium">Tasks ({tasks.length})</h2>
          </div> */}

          <div>
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-row items-center justify-between gap-2 px-3 py-2 my-1 rounded group hover:bg-gray-100"
              >
                <div className="flex flex-row items-center flex-grow gap-2">
                  <input
                    type="checkbox"
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onChange={() => handleToggleTask(task)}
                    className="w-4 h-4 my-auto rounded cursor-pointer accent-blue-500"
                  />

                  {editingTaskId === task.id ? (
                    <div className="flex-grow">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        onBlur={saveEditedTask}
                        className="w-full p-1 border rounded"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => !task.completed && startEditing(task)}
                      className={`flex-grow py-1 ${
                        task.completed
                          ? "line-through text-gray-500"
                          : "cursor-pointer"
                      }`}
                    >
                      <span className="flex items-center">
                        {task.description}
                        {getRelativeTime(task.created) && !task.completed && (
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 ml-2 text-xs text-gray-500 bg-gray-100 rounded-full">
                            {getRelativeTime(task.created)}
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {editingTaskId === task.id ? (
                  <button
                    type="button"
                    onClick={saveEditedTask}
                    className="p-1 text-blue-500 transition-opacity rounded cursor-pointer hover:bg-blue-50"
                    aria-label="Save task"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 text-red-500 transition-opacity rounded opacity-0 cursor-pointer group-hover:opacity-100 hover:bg-red-50"
                    disabled={isDeleting}
                    aria-label="Delete task"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add task form/button with inline display */}
          <div className="mt-4">
            {showAddForm ? (
              <form onSubmit={handleAddTask} className="w-full">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Task description"
                    className="flex-grow p-2 transition-colors border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isCreating}
                  />
                  <div className="flex justify-end gap-2 ml-auto">
                    <Button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      variant="secondary"
                      className="px-3 py-2 font-medium text-gray-600 transition-colors bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isCreating || !newTaskDescription.trim()}
                      className="px-3 py-2 font-medium text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center justify-center w-full gap-2 px-4 py-2 font-medium text-gray-500 transition-colors bg-white border border-gray-500 border-dashed rounded hover:bg-gray-100 hover:cursor-pointer"
              >
                <span>Add Task</span>
                <kbd className="px-1.5 py-0.5 ml-1 text-xs font-semibold text-gray-500  border border-gray-400 rounded shadow-sm">
                  T
                </kbd>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
