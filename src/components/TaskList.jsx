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
        <div className="p-4 text-center text-gray-500">
          Ready to load tasks...
        </div>
      )}

      {/* Show during loading */}
      {isLoading && (
        <div className="p-4 text-center text-gray-500 loading-spinner">
          Loading tasks...
        </div>
      )}

      {/* Show on error */}
      {isError && (
        <div className="p-4 text-center text-red-500 error-message">
          <p>Error: {error?.message || "Failed to load tasks"}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Show when tasks are loaded successfully or when adding a new task */}
      {!isLoading && !isError && (tasks.length > 0 || showAddForm) && (
        <div className="rounded-md">
          <div>
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-row items-center justify-between gap-2 px-3 py-3 my-1 rounded-lg md:py-2 group hover:bg-gray-100"
              >
                <div className="flex flex-row items-center flex-grow gap-3 min-h-[44px] md:min-h-0 md:gap-2">
                  <div className="flex items-center justify-center w-6 h-6 md:w-auto md:h-auto">
                    <input
                      type="checkbox"
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onChange={() => handleToggleTask(task)}
                      className="w-5 h-5 my-auto rounded cursor-pointer md:w-4 md:h-4 accent-blue-500"
                      aria-label={`Mark "${task.description}" as ${
                        task.completed ? "incomplete" : "complete"
                      }`}
                    />
                  </div>

                  {editingTaskId === task.id ? (
                    <div className="flex-grow">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        onBlur={saveEditedTask}
                        className="w-full p-2 text-base border rounded"
                        aria-label="Edit task description"
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
                      <div className="flex items-center">
                        <span className="text-base">{task.description}</span>
                        {getRelativeTime(task.created) && !task.completed && (
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 ml-2 text-xs text-gray-500 bg-gray-100 rounded-full whitespace-nowrap flex-shrink-0">
                            {getRelativeTime(task.created)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {editingTaskId === task.id ? (
                  <button
                    type="button"
                    onClick={saveEditedTask}
                    className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto p-2 md:p-1.5 text-blue-500 transition-opacity rounded-full md:rounded cursor-pointer hover:bg-blue-50"
                    aria-label="Save task"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="md:w-5 md:h-5"
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
                    className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto p-2 md:p-1.5 text-red-500 transition-opacity rounded-full md:rounded cursor-pointer md:opacity-0 md:group-hover:opacity-100 hover:bg-red-50 touch-manipulation"
                    disabled={isDeleting}
                    aria-label={`Delete task "${task.description}"`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="md:w-5 md:h-5"
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
          <div className="mt-6 md:mt-4">
            {showAddForm ? (
              <form onSubmit={handleAddTask} className="w-full">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Task description"
                    className="w-full p-3 text-base transition-colors border border-gray-300 rounded-lg outline-none md:p-2 md:rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isCreating}
                    aria-label="New task description"
                  />
                  <div className="flex justify-end w-full gap-2 sm:w-auto sm:ml-auto">
                    <Button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      variant="secondary"
                      className="w-full px-4 py-3 text-base font-medium text-gray-600 transition-colors bg-white border border-gray-300 rounded-lg md:px-3 md:py-2 md:rounded md:w-auto hover:bg-gray-50"
                      aria-label="Cancel adding new task"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isCreating || !newTaskDescription.trim()}
                      className="w-full px-4 py-3 text-base font-medium text-white transition-colors bg-blue-600 rounded-lg md:px-3 md:py-2 md:rounded md:w-auto hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Add new task"
                    >
                      {isCreating ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center justify-center w-full gap-2 px-4 py-3 text-base font-medium text-gray-600 transition-colors bg-white border border-gray-500 border-dashed rounded-lg md:py-2 md:rounded hover:bg-gray-100 hover:cursor-pointer"
                aria-label="Show add task form"
              >
                <span>Add Task</span>
                <kbd className="hidden px-1.5 py-0.5 ml-1 text-xs font-semibold text-gray-500 border border-gray-400 rounded shadow-sm md:inline-block">
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
