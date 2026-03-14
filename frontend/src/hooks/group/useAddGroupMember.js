import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useAddGroupMember() {
	const queryClient = useQueryClient();
	const { currentConversation, selectConversation } = useConversationContext();

	const mutation = useMutation({
		mutationFn: async (userId) => {
			if (!currentConversation?._id) {
				throw new Error("No conversation selected");
			}

			const participantIds = currentConversation.participants.map(
				(participant) =>
					typeof participant === "string" ? participant : participant._id,
			);

			if (participantIds.includes(userId)) {
				throw new Error("User is already a member");
			}

			const { data } = await axiosInstance.post(
				`/conversations/${currentConversation._id}/participants/${userId}`,
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["conversations"],
			});

			selectConversation(data.data.conversation);
			toast.success("Member added successfully");
		},
		onError: (error) => {
			if (error.message === "User is already a member") return;
			toast.error(error.response?.data?.message || "Failed to add member");
		},
	});

	return {
		addMemberToGroup: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error,
	};
}

export default useAddGroupMember;
