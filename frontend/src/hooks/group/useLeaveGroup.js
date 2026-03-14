import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { useConversationContext } from "@/contexts/ConversationContext";

function useLeaveGroup() {
	const [loading, setLoading] = useState(false);
	const queryClient = useQueryClient();
	const { currentConversation, selectConversation } = useConversationContext();

	const leaveGroup = async () => {
		const conversationId = currentConversation?._id;
		if (!currentConversation?._id) return;
		try {
			setLoading(true);

			const res = await axiosInstance.delete(
				`/conversations/${conversationId}/leave`,
			);

			const leftConversationId =
				res?.data?.data?.conversationId || conversationId;

			queryClient.setQueryData(["conversations"], (oldData) => {
				if (!oldData) return oldData;

				// case 1: query data is array
				if (Array.isArray(oldData)) {
					return oldData.filter((conv) => conv._id !== leftConversationId);
				}

				// case 2: query data is object with conversations array
				if (Array.isArray(oldData.conversations)) {
					return {
						...oldData,
						conversations: oldData.conversations.filter(
							(conv) => conv._id !== leftConversationId,
						),
					};
				}

				return oldData;
			});

			if (currentConversation?._id === leftConversationId) {
				selectConversation(null);
			}

			queryClient.invalidateQueries({ queryKey: ["conversations"] });
			queryClient.removeQueries({
				queryKey: ["conversation", leftConversationId],
			});

			toast.success(res?.data?.message || "You left the group");

			return res;
		} catch (error) {
			console.error(error);
			toast.error(
				error?.response?.data?.message || "Failed to leave the group",
			);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { leaveGroup, loading };
}

export default useLeaveGroup;
