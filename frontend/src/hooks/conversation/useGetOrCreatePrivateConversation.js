import { useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useConversationContext } from "@/contexts/ConversationContext";

function useGetOrCreatePrivateConversation() {
	const [loading, setLoading] = useState(false);
	const { setConversations, selectConversation } = useConversationContext();

	const getOrCreatePrivateConversation = async (contactId) => {
		setLoading(true);

		try {
			// create or get conversation
			const { data } = await axiosInstance.get(
				`/conversations/private/${contactId}`,
				{
					withCredentials: true,
				},
			);

			const conversation = data?.data?.conversation;

			if (conversation) {
				selectConversation(conversation);
			}

			// refresh conversations list
			const res = await axiosInstance.get("/conversations", {
				withCredentials: true,
			});

			setConversations(res?.data?.data?.conversations || []);

			return conversation;
		} finally {
			setLoading(false);
		}
	};

	return { getOrCreatePrivateConversation, loading };
}

export default useGetOrCreatePrivateConversation;
