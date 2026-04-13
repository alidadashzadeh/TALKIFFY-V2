import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useAddGroupAdmin() {
	const queryClient = useQueryClient();
	const { selectConversation, currentConversationId } =
		useConversationContext();

	const mutation = useMutation({
		mutationFn: async ({ userId }) => {
			const { data } = await axiosInstance.post(
				`/conversations/${currentConversationId}/admins/${userId}`,
			);

			return {
				status: data?.status,
				conversation: data?.data?.conversation,
			};
		},

		onMutate: async ({ userId }) => {
			await queryClient.cancelQueries({ queryKey: ["conversations"] });

			const previousConversations =
				queryClient.getQueryData(["conversations"]) || [];

			const previousConversation = previousConversations.find(
				(item) => item._id === currentConversationId,
			);

			const optimisticConversation = previousConversation
				? {
						...previousConversation,
						admins: previousConversation.admins?.some(
							(admin) =>
								(admin?._id || admin)?.toString() === userId.toString(),
						)
							? previousConversation.admins
							: [...(previousConversation.admins || []), userId],
					}
				: null;

			if (optimisticConversation) {
				queryClient.setQueryData(["conversations"], (oldConversations = []) =>
					oldConversations.map((item) =>
						item._id === currentConversationId ? optimisticConversation : item,
					),
				);

				selectConversation(optimisticConversation);
			}

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
			toast.success("Admin Added");
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
		addAdmin: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error,
	};
}

export default useAddGroupAdmin;
