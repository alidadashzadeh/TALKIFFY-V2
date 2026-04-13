import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { getUserId } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useRemoveGroupAdmin() {
	const queryClient = useQueryClient();
	const { currentConversation, currentConversationId, selectConversation } =
		useConversationContext();

	const mutation = useMutation({
		mutationFn: async ({ userId }) => {
			const { data } = await axiosInstance.delete(
				`/conversations/${currentConversationId}/admins/${userId}`,
			);

			return {
				status: data?.status,
				conversation: data?.data?.conversation,
			};
		},

		onMutate: async ({ userId }) => {
			await queryClient.cancelQueries({
				queryKey: ["conversations"],
			});

			const previousConversations =
				queryClient.getQueryData(["conversations"]) || [];
			const previousConversation = currentConversation;

			if (!currentConversation?._id) {
				return { previousConversations, previousConversation };
			}

			const optimisticConversation = {
				...currentConversation,
				admins: (currentConversation.admins || []).filter((admin) => {
					return getUserId(admin) !== getUserId(userId);
				}),
			};

			queryClient.setQueryData(["conversations"], (oldConversations = []) =>
				oldConversations.map((item) =>
					item._id === currentConversation._id ? optimisticConversation : item,
				),
			);

			selectConversation(optimisticConversation);

			return {
				previousConversations,
				previousConversation,
			};
		},

		onSuccess: ({ status, conversation }) => {
			if (status !== "success" || !conversation) return;

			queryClient.setQueryData(["conversations"], (oldConversations = []) => {
				return oldConversations.map((item) =>
					item._id === conversation._id ? conversation : item,
				);
			});

			selectConversation(conversation);
			toast.success("Admin Removed");
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
		removeAdmin: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error,
	};
}

export default useRemoveGroupAdmin;
