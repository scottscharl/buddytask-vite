// src/hooks/useTasks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePocket } from "../contexts/PocketContext";

// Hook for fetching tasks
export function useTasks() {
  const { pb, user } = usePocket();

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      return await pb.collection("tasks").getFullList({
        filter: `owner="${user.id}"`,
        sort: "",
      });
    },
    enabled: !!user?.id,
  });

  return {
    tasks,
    isLoading,
    isError,
    error,
    refetch,
  };
}

// Hook for task mutations with optimistic updates
export function useTaskMutations() {
  const { pb, user } = usePocket();
  const queryClient = useQueryClient();

  // Update task mutation with optimistic updates
  const updateMutation = useMutation({
    mutationFn: async ({ taskId, taskData }) => {
      if (!user?.id) throw new Error("No user logged in");
      return await pb.collection("tasks").update(taskId, taskData);
    },
    // This happens immediately, before the server request
    onMutate: async ({ taskId, taskData }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the current value
      const previousTasks = queryClient.getQueryData(["tasks", user?.id]);

      // Optimistically update the UI
      queryClient.setQueryData(["tasks", user?.id], (old) =>
        old.map((task) =>
          task.id === taskId ? { ...task, ...taskData } : task
        )
      );

      // Return context with the previous data
      return { previousTasks };
    },
    // If the mutation fails, use the context we returned above
    onError: (err, variables, context) => {
      // Roll back to the previous state if there's an error
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", user?.id], context.previousTasks);
      }
      console.error("Error updating task:", err);
    },
    // Refetch after error or success to ensure data consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Create task mutation with optimistic updates
  const createMutation = useMutation({
    mutationFn: async (taskData) => {
      if (!user?.id) throw new Error("No user logged in");

      const data = {
        ...taskData,
        owner: user.id,
      };

      return await pb.collection("tasks").create(data);
    },
    onMutate: async (taskData) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData(["tasks", user?.id]);

      // Create a temporary ID for the optimistic update
      const tempTask = {
        ...taskData,
        id: "temp-" + Date.now(),
        owner: user.id,
        // Add any other default fields your tasks might have
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };

      queryClient.setQueryData(["tasks", user?.id], (old) =>
        old ? [...old, tempTask] : [tempTask]
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", user?.id], context.previousTasks);
      }
      console.error("Error creating task:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Delete task mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: async (taskId) => {
      if (!user?.id) throw new Error("No user logged in");
      return await pb.collection("tasks").delete(taskId);
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData(["tasks", user?.id]);

      queryClient.setQueryData(["tasks", user?.id], (old) =>
        old.filter((task) => task.id !== taskId)
      );

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", user?.id], context.previousTasks);
      }
      console.error("Error deleting task:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    createTask: createMutation.mutate,
    createTaskAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateTask: updateMutation.mutate,
    updateTaskAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteTask: deleteMutation.mutate,
    deleteTaskAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,

    // Overall status
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    hasError:
      !!createMutation.error ||
      !!updateMutation.error ||
      !!deleteMutation.error,
  };
}
