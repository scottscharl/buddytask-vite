import { useQuery } from "@tanstack/react-query";
import { usePocket } from "../contexts/PocketContext";

/**
 * Hook for fetching partner's tasks (read-only)
 *
 * Finds the partnership record for the current user,
 * retrieves the partner's ID, and fetches their tasks
 */
export function usePartnerTasks() {
  const { pb, user } = usePocket();

  // First, query the partnership to get the partner's ID
  const {
    data: partnershipData,
    isLoading: isLoadingPartnership,
    isError: isPartnershipError,
    error: partnershipError,
  } = useQuery({
    queryKey: ["partnership", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      try {
        // Find the partnership where the current user is either partner1 or partner2
        const partnership = await pb
          .collection("partnerships")
          .getFirstListItem(`partner1="${user.id}" || partner2="${user.id}"`);

        // Determine which user is the partner (the one that's not the current user)
        const partnerId =
          partnership.partner1 === user.id
            ? partnership.partner2
            : partnership.partner1;

        return {
          partnership,
          partnerId,
        };
      } catch (error) {
        console.error("Error fetching partnership:", error);
        return null;
      }
    },
    enabled: !!user?.id,
  });

  // Then, use the partner's ID to fetch their tasks
  const {
    data: partnerTasks = [],
    isLoading: isLoadingTasks,
    isError: isTasksError,
    error: tasksError,
    refetch,
  } = useQuery({
    queryKey: ["partnerTasks", partnershipData?.partnerId],
    queryFn: async () => {
      if (!partnershipData?.partnerId) return [];

      try {
        // Using getFullList to avoid pagination
        const result = await pb.collection("tasks").getFullList({
          filter: `owner="${partnershipData.partnerId}"`,
          sort: "-created", // Sort by newest first, you can change this as needed
        });

        // getFullList should return the array directly
        return result;
      } catch (error) {
        console.error("Error fetching partner tasks:", error);
        return [];
      }
    },
    enabled: !!partnershipData?.partnerId,
  });

  return {
    // Partnership data
    partnership: partnershipData?.partnership,
    partnerId: partnershipData?.partnerId,

    // Partner's tasks
    partnerTasks,

    // Loading states
    isLoading: isLoadingPartnership || isLoadingTasks,

    // Error states
    isError: isPartnershipError || isTasksError,
    error: partnershipError || tasksError,

    // Functions
    refetch,
  };
}
