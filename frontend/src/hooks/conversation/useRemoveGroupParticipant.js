import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useRemoveGroupParticipant() {
	const queryClient = useQueryClient();
	const { selectConversation } = useConversationContext();

	const mutation = useMutation({
		mutationFn: async ({ conversationId, userId }) => {
			const res = await axiosInstance.delete(
				`/conversations/${conversationId}/participants/${userId}`,
			);

			return res.data;
		},

		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["conversations"],
			});
			toast.success("Member added successfully");
			// console.log(data);
			selectConversation(data.data.conversation);
		},
	});

	return {
		removeParticipant: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error,
	};
}

export default useRemoveGroupParticipant;
