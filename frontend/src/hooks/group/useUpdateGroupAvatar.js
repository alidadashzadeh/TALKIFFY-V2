import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useConversationContext } from "@/contexts/ConversationContext";

function useUpdateGroupAvatar() {
	const [loading, setLoading] = useState(false);
	const queryClient = useQueryClient();
	const { currentConversation, selectConversation } = useConversationContext();

	const updateGroupAvatar = async (conversationId, file) => {
		try {
			setLoading(true);

			const formData = new FormData();
			formData.append("avatar", file);

			const { data } = await axiosInstance.patch(
				`/conversations/${conversationId}/avatar`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);

			const updatedConversation = data?.data?.conversation;

			if (!updatedConversation) {
				toast.success(data?.message || "Group avatar updated");
				return data;
			}

			queryClient.setQueryData(["conversations"], (oldData) => {
				if (!oldData) return oldData;

				if (Array.isArray(oldData)) {
					return oldData.map((conv) =>
						conv._id === updatedConversation._id ? updatedConversation : conv,
					);
				}

				if (Array.isArray(oldData.conversations)) {
					return {
						...oldData,
						conversations: oldData.conversations.map((conv) =>
							conv._id === updatedConversation._id ? updatedConversation : conv,
						),
					};
				}

				return oldData;
			});

			queryClient.setQueryData(
				["conversation", updatedConversation._id],
				updatedConversation,
			);

			if (currentConversation?._id === updatedConversation._id) {
				selectConversation(updatedConversation);
			}

			toast.success(data?.message || "Group avatar updated");
			return data;
		} catch (error) {
			console.error(error);
			toast.error(
				error?.response?.data?.message || "Failed to update group avatar",
			);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { updateGroupAvatar, loading };
}

export default useUpdateGroupAvatar;
