import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";
import { useConversationContext } from "@/contexts/ConversationContext";
import { handleErrorToast } from "@/lib/errorHandler";

function useGetOrCreatePrivateConversation() {
	const queryClient = useQueryClient();
	const { selectConversation } = useConversationContext();

	const { mutateAsync: getOrCreatePrivateConversation, isPending: loading } =
		useMutation({
			mutationFn: async (contactId) => {
				const { data } = await axiosInstance.get(
					`/conversations/private/${contactId}`,
				);
				return {
					status: data?.status,
					conversation: data?.data?.conversation,
				};
			},

			onSuccess: ({ status, conversation }) => {
				if (status !== "success") return;

				selectConversation(conversation);

				queryClient.setQueryData(["conversations"], (oldConversations = []) => {
					const exists = oldConversations.some(
						(item) => item._id === conversation._id,
					);

					if (!exists) {
						return [conversation, ...oldConversations];
					}

					return oldConversations.map((item) =>
						item._id === conversation._id ? conversation : item,
					);
				});
			},

			onError: (error) => {
				handleErrorToast(error);
			},
		});

	return { getOrCreatePrivateConversation, loading };
}

export default useGetOrCreatePrivateConversation;
