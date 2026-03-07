import { useCallback, useEffect, useState } from "react";

import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { useConversationContext } from "@/contexts/ConversationContext";

function useGetMyConversations() {
	const [loading, setLoading] = useState(false);
	const { conversations, setConversations } = useConversationContext();

	const getConversations = useCallback(async () => {
		setLoading(true);

		try {
			const { data } = await axiosInstance.get("/conversations");
			setConversations(data?.data?.conversations || []);
		} catch (error) {
			handleErrorToast(error);
		} finally {
			setLoading(false);
		}
	}, [setConversations]);

	useEffect(() => {
		getConversations();
	}, [getConversations]);

	return {
		conversations,
		loading,
		setConversations,
		refetchConversations: getConversations,
	};
}

export default useGetMyConversations;
