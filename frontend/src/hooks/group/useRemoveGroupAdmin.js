import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { getUserId } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useRemoveGroupAdmin() {
	const queryClient = useQueryClient();
	const { currentConversationId, selectConversation } =
		useConversationContext();

	const { mutateAsync: removeAdmin, isPending: loading } = useMutation({
		mutationFn: async (userId) => {
			const { data } = await axiosInstance.delete(
				`/conversations/${currentConversationId}/admins/${userId}`,
			);

			if (data?.status !== "success" || !data?.data?.conversation) {
				throw new Error(data?.message || "Failed to remove admin");
			}

			return data.data.conversation;
		},

		onMutate: async (userId) => {
			if (!currentConversationId) {
				throw new Error("No conversation selected");
			}

			if (!userId) {
				throw new Error("No user selected");
			}

			await queryClient.cancelQueries({
				queryKey: ["conversations"],
			});

			const previousConversations =
				queryClient.getQueryData(["conversations"]) || [];

			const previousConversation = previousConversations.find(
				(item) => item._id === currentConversationId,
			);

			if (!previousConversation) {
				throw new Error("Conversation not found in cache");
			}

			const isAdmin = (previousConversation.admins || []).some(
				(admin) => getUserId(admin)?.toString() === userId.toString(),
			);

			if (!isAdmin) {
				throw new Error("User is not an admin");
			}

			const optimisticConversation = {
				...previousConversation,
				admins: (previousConversation.admins || []).filter(
					(admin) => getUserId(admin)?.toString() !== userId.toString(),
				),
			};

			queryClient.setQueryData(["conversations"], (oldConversations = []) =>
				oldConversations.map((item) =>
					item._id === currentConversationId ? optimisticConversation : item,
				),
			);

			selectConversation(optimisticConversation);

			return {
				previousConversations,
				previousConversation,
			};
		},

		onSuccess: (conversation) => {
			queryClient.setQueryData(["conversations"], (oldConversations = []) =>
				oldConversations.map((item) =>
					item._id === conversation._id ? conversation : item,
				),
			);

			selectConversation(conversation);
			toast.success("Admin removed");
		},

		onError: (error, _userId, context) => {
			if (context?.previousConversations) {
				queryClient.setQueryData(
					["conversations"],
					context.previousConversations,
				);
			}

			if (context?.previousConversation) {
				selectConversation(context.previousConversation);
			}

			handleErrorToast(error);
		},
	});

	return {
		removeAdmin,
		loading,
	};
}

export default useRemoveGroupAdmin;
