import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useAddGroupAdmin() {
	const queryClient = useQueryClient();
	const { selectConversation } = useConversationContext();

	const mutation = useMutation({
		mutationFn: async ({ conversationId, userId }) => {
			const res = await axiosInstance.post(
				`/conversations/${conversationId}/admins/${userId}`,
			);

			return res.data;
		},

		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
			selectConversation(data.data.conversation);
			toast.success("Admin Added");
		},
	});

	return {
		addAdmin: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error,
	};
}

export default useAddGroupAdmin;
