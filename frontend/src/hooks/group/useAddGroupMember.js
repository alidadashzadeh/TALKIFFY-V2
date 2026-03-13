import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useAddGroupMember() {
	const queryClient = useQueryClient();
	const { selectConversation } = useConversationContext();

	const mutation = useMutation({
		mutationFn: async ({ conversationId, userId }) => {
			const { data } = await axiosInstance.post(
				`/conversations/${conversationId}/participants/${userId}`,
			);
			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["conversations"],
			});
			toast.success("Member added successfully");

			selectConversation(data.data.conversation);
		},
	});

	return {
		addMemberToGroup: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error,
	};
}

export default useAddGroupMember;
