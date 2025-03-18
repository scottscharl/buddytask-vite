import { useState, useEffect } from "react";
import { usePartnerTasks } from "../hooks/usePartnerTasks";

export default function PartnerTaskList({ colorScheme = "blue" }) {
  const { partnerTasks, isLoading, isError, error, refetch } =
    usePartnerTasks();
  const [expandedTaskId, setExpandedTaskId] = useState(null);

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

  // Add keyboard shortcut listener for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape key to cancel any expanded task view
      if (e.key === "Escape" && expandedTaskId) {
        setExpandedTaskId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expandedTaskId]);

  // Toggle task expansion for mobile/responsive view
  const toggleTaskExpansion = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  // Get the color based on the colorScheme prop
  const getCheckboxFillColor = () => {
    return colorScheme === "amber" ? "#F59E0B" : "#3B82F6"; // amber-500 or blue-500
  };

  // Get the color class based on the colorScheme prop
  const getCheckboxColorClass = () => {
    return colorScheme === "amber" ? "text-amber-500" : "text-blue-500";
  };

  return (
    <div>
      {/* Show when waiting for partner data */}
      {!isLoading && partnerTasks.length === 0 && !isError && (
        <div>Your partner doesn't have any tasks yet.</div>
      )}

      {/* Show during loading */}
      {isLoading && (
        <div className="loading-spinner">Loading partner's tasks...</div>
      )}

      {/* Show on error */}
      {isError && (
        <div className="error-message">
          <p>Error: {error?.message || "Failed to load partner's tasks"}</p>
          <button
            onClick={refetch}
            className={`px-3 py-1 mt-2 text-sm ${
              colorScheme === "amber"
                ? "text-amber-700 bg-amber-100 hover:bg-amber-200"
                : "text-blue-700 bg-blue-100 hover:bg-blue-200"
            } rounded`}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Show when tasks are loaded successfully */}
      {!isLoading && !isError && partnerTasks.length > 0 && (
        <div>
          <div className="flex flex-row items-center justify-between">
            {/* <h2 className="mb-3 text-xl font-medium">
              Partner's Tasks ({partnerTasks.length})
            </h2> */}
          </div>

          <div>
            {partnerTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-row items-center justify-between gap-2 px-3 py-2 my-1 rounded group hover:bg-gray-100"
              >
                <div className="flex flex-row items-center flex-grow gap-2">
                  {/* Use a fake checkbox that matches the style of the real ones with dynamic color */}
                  <div
                    className={`w-4 h-4 my-auto rounded ${
                      colorScheme === "amber"
                        ? "accent-amber-500"
                        : "accent-blue-500"
                    }`}
                  >
                    {task.completed ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        className={getCheckboxColorClass()}
                      >
                        <rect
                          width="16"
                          height="16"
                          rx="2"
                          fill={getCheckboxFillColor()}
                        />
                        <path
                          d="M4 8L7 11L12 5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-gray-400"
                      >
                        <rect
                          x="0.5"
                          y="0.5"
                          width="15"
                          height="15"
                          rx="2"
                          stroke="currentColor"
                          fill="white"
                        />
                      </svg>
                    )}
                  </div>

                  <div
                    className={`flex-grow py-1 ${
                      task.completed ? "line-through text-gray-500" : ""
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
