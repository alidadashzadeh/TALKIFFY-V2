import { useEffect, useState } from "react";

import { axiosInstance } from "@/utils/axios";
import { handleErrorToast } from "@/utils/errorHandler";

function useGetMessages(conversationId) {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!conversationId) return;

		const fetchMessages = async () => {
			setLoading(true);

			try {
				const { data } = await axiosInstance.get(`/messages/${conversationId}`);

				setMessages(data?.data?.messages || []);
			} catch (error) {
				handleErrorToast(error);
			} finally {
				setLoading(false);
			}
		};

		fetchMessages();
	}, [conversationId]);

	return { messages, loading };
}

export default useGetMessages;
