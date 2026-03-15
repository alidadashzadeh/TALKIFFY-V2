import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useRemoveGroupAdmin() {
	const queryClient = useQueryClient();
	const { selectConversation, currentConversationId } =
		useConversationContext();

	const mutation = useMutation({
		mutationFn: async ({ userId }) => {
			const res = await axiosInstance.delete(
				`/conversations/${currentConversationId}/admins/${userId}`,
			);

			return res.data;
		},

		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
			selectConversation(data.data.conversation);
			toast.success("Admin Removed");
		},
	});

	return {
		removeAdmin: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error,
	};
}

export default useRemoveGroupAdmin;
