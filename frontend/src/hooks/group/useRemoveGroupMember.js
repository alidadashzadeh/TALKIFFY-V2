import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { getUserId } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useRemoveGroupMember() {
	const queryClient = useQueryClient();
	const { currentConversation, selectConversation } = useConversationContext();

	const mutation = useMutation({
		mutationFn: async ({ conversationId, userId }) => {
			const { data } = await axiosInstance.delete(
				`/conversations/${conversationId}/participants/${userId}`,
			);

			return {
				status: data?.status,
				conversation: data?.data?.conversation,
			};
		},

		onMutate: async ({ conversationId, userId }) => {
			await queryClient.cancelQueries({
				queryKey: ["conversations"],
			});

			const previousConversations =
				queryClient.getQueryData(["conversations"]) || [];
			const previousConversation = currentConversation;

			const optimisticConversation =
				currentConversation?._id === conversationId
					? {
							...currentConversation,
							participants: (currentConversation.participants || []).filter(
								(participant) => {
									return getUserId(participant) !== getUserId(userId);
								},
							),
						}
					: null;

			queryClient.setQueryData(["conversations"], (oldConversations = []) =>
				oldConversations.map((item) => {
					if (item._id !== conversationId) return item;

					return {
						...item,
						participants: (item.participants || []).filter((participant) => {
							return getUserId(participant) !== getUserId(userId);
						}),
					};
				}),
			);

			if (optimisticConversation) {
				selectConversation(optimisticConversation);
			}

			return {
				previousConversations,
				previousConversation,
			};
		},

		onSuccess: ({ status, conversation }) => {
			if (status !== "success" || !conversation) return;

			queryClient.setQueryData(["conversations"], (oldConversations = []) =>
				oldConversations.map((item) =>
					item._id === conversation._id ? conversation : item,
				),
			);

			toast.success("Member Removed Successfully");
			selectConversation(conversation);
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
		removeParticipant: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error,
	};
}

export default useRemoveGroupMember;
