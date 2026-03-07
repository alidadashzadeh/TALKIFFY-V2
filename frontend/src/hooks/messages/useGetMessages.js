import { useQuery } from "@tanstack/react-query";

import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";

function useGetMessages() {
	const { currentConversationId } = useConversationContext();
	const query = useQuery({
		queryKey: ["messages", currentConversationId],

		queryFn: async () => {
			const { data } = await axiosInstance.get(
				`/messages/conversation/${currentConversationId}`,
			);

			return data?.data?.messages || [];
		},

		enabled: !!currentConversationId,

		onError: (error) => {
			handleErrorToast(error);
		},
	});

	return query;
}

export default useGetMessages;
