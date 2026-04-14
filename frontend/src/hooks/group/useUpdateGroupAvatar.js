import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { useConversationContext } from "@/contexts/ConversationContext";
import { handleErrorToast } from "@/lib/errorHandler";

function useUpdateGroupAvatar() {
	const queryClient = useQueryClient();
	const { selectConversation } = useConversationContext();

	const { mutateAsync: updateGroupAvatar, isPending: loading } = useMutation({
		mutationFn: async ({ conversationId, file }) => {
			const formData = new FormData();
			formData.append("avatar", file);

			const { data } = await axiosInstance.patch(
				`/conversations/${conversationId}/avatar`,
				formData,
			);

			if (data?.status !== "success" || !data?.data?.conversation) {
				throw new Error(data?.message || "Failed to update group avatar");
			}

			return data.data.conversation;
		},

		onMutate: async ({ conversationId, file }) => {
			if (!file || !conversationId) {
				throw new Error("File and conversation ID are required");
			}

			const previewUrl = URL.createObjectURL(file);

			await queryClient.cancelQueries({ queryKey: ["conversations"] });
			await queryClient.cancelQueries({
				queryKey: ["conversation", conversationId],
			});

			const previousConversations =
				queryClient.getQueryData(["conversations"]) || [];
			const previousConversation = queryClient.getQueryData([
				"conversation",
				conversationId,
			]);

			const optimisticConversation = previousConversation
				? { ...previousConversation, avatar: previewUrl }
				: null;

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

			if (optimisticConversation) {
				selectConversation(optimisticConversation);
			}

			return {
				previousConversations,
				previousConversation,
				previewUrl,
			};
		},

		onSuccess: (updatedConversation, variables) => {
			const realUrl = updatedConversation.avatar;

			const img = new window.Image();
			img.src = realUrl;

			img.onload = () => {
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
			};

			toast.success("Group avatar updated");
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
			handleErrorToast(message);
		},
		onSettled: (data, error, variables, context) => {
			if (context?.previewUrl) {
				URL.revokeObjectURL(context.previewUrl);
			}
		},
	});

	return { updateGroupAvatar, loading };
}

export default useUpdateGroupAvatar;
