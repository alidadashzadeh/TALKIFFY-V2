import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useConversationContext } from "@/contexts/ConversationContext";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";

function useGetMessages() {
	const { currentConversationId } = useConversationContext();

	const {
		data: messages = [],
		isPending: loading,
		isFetching: fetching,
		isError,
		error,
	} = useQuery({
		queryKey: ["messages", currentConversationId],

		queryFn: async () => {
			const { data } = await axiosInstance.get(
				`/conversations/${currentConversationId}/messages`,
			);

			return data?.data?.messages || [];
		},

		enabled: !!currentConversationId,
		retry: false,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	useEffect(() => {
		if (isError) {
			handleErrorToast(error);
		}
	}, [isError, error]);

	return { messages, loading, fetching };
}

export default useGetMessages;
