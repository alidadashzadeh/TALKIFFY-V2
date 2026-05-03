import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useUpdateGroupName() {
	const queryClient = useQueryClient();
	const { currentConversation, selectConversation } = useConversationContext();

	const { mutateAsync: updateGroupName, isPending: loading } = useMutation({
		mutationFn: async (name) => {
			const trimmedName = name.trim();

			const { data } = await axiosInstance.patch(
				`/conversations/${currentConversation._id}/name`,
				{ name: trimmedName },
			);

			if (data?.status !== "success" || !data?.data?.conversation) {
				throw new Error(data?.message || "Failed to update group name");
			}

			return data.data.conversation;
		},

		onMutate: async (name) => {
			if (!currentConversation?._id) {
				throw new Error("No conversation selected");
			}

			const trimmedName = name.trim();

			if (!trimmedName) {
				throw new Error("Group name cannot be empty");
			}

			await queryClient.cancelQueries({
				queryKey: ["conversations"],
			});

			const previousConversations =
				queryClient.getQueryData(["conversations"]) || [];
			const previousConversation = currentConversation;

			const optimisticConversation = {
				...currentConversation,
				name: trimmedName,
			};

			queryClient.setQueryData(["conversations"], (old = []) =>
				old.map((item) =>
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
			queryClient.setQueryData(["conversations"], (old = []) =>
				old.map((item) =>
					item._id === conversation._id ? conversation : item,
				),
			);

			selectConversation(conversation);

			toast.success("Group name updated successfully");
		},

		onError: (error, _name, context) => {
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
		updateGroupName,
		loading,
	};
}

export default useUpdateGroupName;
