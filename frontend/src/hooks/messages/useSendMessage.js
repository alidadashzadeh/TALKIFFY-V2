import { useState } from "react";

import { useMessagesContext } from "../../contexts/MessagesContext.jsx";
import { useSocketContext } from "../../contexts/SocketContext.jsx";

import { axiosInstance } from "../../utils/axios.js";
import { handleErrorToast } from "../../utils/errorHandler.js";
import { useConversationContext } from "@/contexts/ConversationContext.jsx";

function useSendMessage() {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages } = useMessagesContext();
	const { socket, onlineUsers } = useSocketContext();
	const { currentConversation } = useConversationContext();

	const sendMessage = async ({ message: messageContent }) => {
		setLoading(true);

		try {
			const { data } = await axiosInstance.post(
				`/messages/conversation/${currentConversation._id}`,
				{ content: messageContent },
			);
			setMessages([...messages, data?.data.newMessage]);

			// if (onlineUsers.includes(currentContactId)) {
			// 	socket.emit("setMessage", data?.data?.newMessage);
			// }
		} catch (error) {
			handleErrorToast(error);
		} finally {
			setLoading(false);
		}
	};

	return { loading, sendMessage };
}

export default useSendMessage;
