import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { getUserId } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useAddGroupMember() {
	const queryClient = useQueryClient();
	const { currentConversation, selectConversation } = useConversationContext();

	const { mutateAsync: addMemberToGroup, isPending: loading } = useMutation({
		mutationFn: async (userId) => {
			const { data } = await axiosInstance.post(
				`/conversations/${currentConversation._id}/participants/${userId}`,
			);

			if (data?.status !== "success" || !data?.data?.conversation) {
				throw new Error(data?.message || "Failed to add member");
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

			const participantIds = currentConversation.participants.map(
				(participant) => getUserId(participant),
			);

			if (participantIds.includes(userId)) {
				throw new Error("User is already a member");
			}

			const optimisticConversation = {
				...currentConversation,
				participants: [...currentConversation.participants, userId],
			};

			queryClient.setQueryData(["conversations"], (oldConversations = []) =>
				oldConversations.map((item) =>
					item._id === optimisticConversation._id
						? optimisticConversation
						: item,
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
			toast.success("Member added successfully");
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
		addMemberToGroup,
		loading,
	};
}

export default useAddGroupMember;
