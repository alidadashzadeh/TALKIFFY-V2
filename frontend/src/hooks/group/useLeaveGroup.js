import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { useConversationContext } from "@/contexts/ConversationContext";

function useLeaveGroup() {
	const queryClient = useQueryClient();
	const { currentConversation, selectConversation } = useConversationContext();

	const { mutateAsync: leaveGroup, isPending: loading } = useMutation({
		mutationFn: async () => {
			const conversationId = currentConversation?._id;

			if (!conversationId) {
				throw new Error("No conversation selected");
			}

			const { data } = await axiosInstance.delete(
				`/conversations/${conversationId}/leave`,
			);

			return {
				status: data?.status,
				conversationId: data?.data?.conversationId || conversationId,
			};
		},

		onMutate: async () => {
			const conversationId = currentConversation?._id;

			if (!conversationId) return {};

			await queryClient.cancelQueries({
				queryKey: ["conversations"],
			});

			const previousConversations =
				queryClient.getQueryData(["conversations"]) || [];
			const previousConversation = currentConversation;

			queryClient.setQueryData(["conversations"], (oldConversations = []) =>
				oldConversations.filter(
					(conversation) => conversation._id !== conversationId,
				),
			);

			if (currentConversation?._id === conversationId) {
				selectConversation(null);
			}

			return {
				previousConversations,
				previousConversation,
			};
		},

		onSuccess: ({ status, conversationId }) => {
			if (status !== "success") return;

			queryClient.removeQueries({
				queryKey: ["conversation", conversationId],
			});

			queryClient.removeQueries({
				queryKey: ["messages", conversationId],
			});

			toast.success("You left the group");
		},

		onError: (error, _variables, context) => {
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
		leaveGroup,
		loading,
	};
}

export default useLeaveGroup;
