import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

function useMarkMessagesSeen() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ conversationId, lastSeenMessageId }) => {
			const { data } = await axiosInstance.patch("/messages/update-seen", {
				conversationId,
				lastSeenMessageId,
			});

			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["messages", variables.conversationId],
			});
		},
	});
}

export default useMarkMessagesSeen;
