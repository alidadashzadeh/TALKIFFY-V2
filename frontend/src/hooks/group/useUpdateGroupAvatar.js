import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { useConversationContext } from "@/contexts/ConversationContext";

function useUpdateGroupAvatar() {
	const queryClient = useQueryClient();
	const { currentConversation, selectConversation } = useConversationContext();

	const { mutateAsync: updateGroupAvatar, isPending: loading } = useMutation({
		mutationFn: async ({ conversationId, file }) => {
			const formData = new FormData();
			formData.append("avatar", file);

			const { data } = await axiosInstance.patch(
				`/conversations/${conversationId}/avatar`,
				formData,
			);

			return data;
		},

		onMutate: async ({ conversationId, file }) => {
			if (!file || !conversationId) return;

			const previewUrl = URL.createObjectURL(file);

			await queryClient.cancelQueries({ queryKey: ["conversations"] });
			await queryClient.cancelQueries({
				queryKey: ["conversation", conversationId],
			});

			const previousConversations = queryClient.getQueryData(["conversations"]);
			const previousConversation = queryClient.getQueryData([
				"conversation",
				conversationId,
			]);
			const previousCurrentConversation = currentConversation;

			queryClient.setQueryData(["conversations"], (oldData = []) =>
				oldData.map((conversation) =>
					conversation._id === conversationId
						? { ...conversation, avatar: previewUrl }
						: conversation,
				),
			);

			queryClient.setQueryData(
				["conversation", conversationId],
				(oldConversation) =>
					oldConversation
						? { ...oldConversation, avatar: previewUrl }
						: oldConversation,
			);

			return {
				previousConversations,
				previousConversation,
				previousCurrentConversation,
				previewUrl,
			};
		},

		onError: (error, variables, context) => {
			if (context?.previousConversations) {
				queryClient.setQueryData(
					["conversations"],
					context.previousConversations,
				);
			}

			if (context?.previousConversation) {
				queryClient.setQueryData(
					["conversation", variables.conversationId],
					context.previousConversation,
				);
			}

			const message =
				error?.response?.data?.message || "Failed to update group avatar";
			toast.error(message);
		},

		onSuccess: (data, variables) => {
			const updatedConversation = data?.data?.conversation;
			if (!updatedConversation) return;

			queryClient.setQueryData(["conversations"], (oldData = []) =>
				oldData.map((conversation) =>
					conversation._id === variables.conversationId
						? updatedConversation
						: conversation,
				),
			);

			queryClient.setQueryData(
				["conversation", variables.conversationId],
				updatedConversation,
			);

			selectConversation(updatedConversation);

			toast.success("Group avatar updated");
		},

		onSettled: (data, error, variables, context) => {
			if (context?.previewUrl) {
				URL.revokeObjectURL(context.previewUrl);
			}

			queryClient.invalidateQueries({ queryKey: ["conversations"] });
			queryClient.invalidateQueries({
				queryKey: ["conversation", variables.conversationId],
			});
		},
	});

	return { updateGroupAvatar, loading };
}

export default useUpdateGroupAvatar;
