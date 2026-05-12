import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { getUserId } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useRemoveGroupMember() {
	const queryClient = useQueryClient();
	const { currentConversation, selectConversation } = useConversationContext();

	const { mutateAsync: removeParticipant, isPending: loading } = useMutation({
		mutationFn: async (userId) => {
			const { data } = await axiosInstance.delete(
				`/conversations/${currentConversation?._id}/participants/${userId}`,
			);

			if (data?.status !== "success" || !data?.data?.conversation) {
				throw new Error(data?.message || "Failed to remove member");
			}

			return data.data.conversation;
		},

		onMutate: async (userId) => {
			if (!currentConversation?._id) {
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

			const previousConversation = currentConversation;

			if (
				!currentConversation ||
				currentConversation._id !== currentConversation?._id
			) {
				throw new Error("Conversation mismatch");
			}

			const isMember = (currentConversation.participants || []).some(
				(participant) =>
					getUserId(participant)?.toString() === userId.toString(),
			);

			if (!isMember) {
				throw new Error("User is not a member");
			}

			const optimisticConversation = {
				...currentConversation,
				participants: (currentConversation.participants || []).filter(
					(participant) =>
						getUserId(participant)?.toString() !== userId.toString(),
				),
			};

			queryClient.setQueryData(["conversations"], (old = []) =>
				old.map((item) =>
					item._id === currentConversation?._id ? optimisticConversation : item,
				),
			);

			selectConversation(optimisticConversation);

			return {
				previousConversations,
				previousConversation,
			};
		},

		onSuccess: (conversation) => {
			queryClient.setQueryData(["conversations"], (old = []) =>
				old.map((item) =>
					item._id === conversation._id ? conversation : item,
				),
			);

			selectConversation(conversation);
			toast.success("Member removed successfully");
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
		removeParticipant,
		loading,
	};
}

export default useRemoveGroupMember;
