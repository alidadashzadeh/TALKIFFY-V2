import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";
import { useConversationContext } from "@/contexts/ConversationContext";

function useGetOrCreatePrivateConversation() {
	const [loading, setLoading] = useState(false);

	const queryClient = useQueryClient();
	const { selectConversation } = useConversationContext();

	const getOrCreatePrivateConversation = async (contactId) => {
		setLoading(true);

		try {
			const { data } = await axiosInstance.get(
				`/conversations/private/${contactId}`,
			);

			const conversation = data?.data?.conversation;

			if (conversation) {
				selectConversation(conversation);
			}

			queryClient.invalidateQueries({
				queryKey: ["conversations"],
			});

			return conversation;
		} finally {
			setLoading(false);
		}
	};

	return { getOrCreatePrivateConversation, loading };
}

export default useGetOrCreatePrivateConversation;
