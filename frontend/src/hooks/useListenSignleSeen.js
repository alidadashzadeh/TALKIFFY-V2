import { useEffect } from "react";

import { useSocketContext } from "../contexts/SocketContext";
import { useMessagesContext } from "../contexts/MessagesContext";

import { handleErrorToast } from "../lib/errorHandler";

function useListenSeen() {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useMessagesContext();

	useEffect(() => {
		socket?.on("getSeen", (lastMessage) => {
			const seenMessage = async () => {
				try {
					setMessages((messages) =>
						messages?.map((message) =>
							message._id === lastMessage._id
								? { ...message, isSeen: true }
								: message,
						),
					);
				} catch (error) {
					handleErrorToast(error);
				}
			};

			seenMessage();
		});

		return () => socket?.off("getDelivered");
	}, [socket, setMessages, messages]);
}

export default useListenSeen;
