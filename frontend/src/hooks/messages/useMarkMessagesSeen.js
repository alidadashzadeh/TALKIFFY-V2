import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";

function useMarkMessagesSeen() {
	const queryClient = useQueryClient();

	const { mutateAsync: markMessagesSeen, isPending: loading } = useMutation({
		mutationFn: async ({ conversationId, lastSeenMessageId }) => {
			const { data } = await axiosInstance.patch("/conversations/update-seen", {
				conversationId,
				lastSeenMessageId,
			});

			return data;
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["messages", variables.conversationId],
			});

			queryClient.invalidateQueries({
				queryKey: ["conversations"],
			});
		},
		onError: (error) => {
			handleErrorToast(error);
		},
	});

	return {
		markMessagesSeen,
		loading,
	};
}

export default useMarkMessagesSeen;
