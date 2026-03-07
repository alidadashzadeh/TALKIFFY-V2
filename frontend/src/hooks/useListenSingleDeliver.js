import { useEffect } from "react";

import { useSocketContext } from "../contexts/SocketContext";
import { useMessagesContext } from "../contexts/MessagesContext";

import { handleErrorToast } from "../lib/errorHandler";
import { axiosInstance } from "../lib/axios";

function useListenDeliver() {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useMessagesContext();

	useEffect(() => {
		socket?.on("getDelivered", (lastMessage) => {
			const deliverMessage = async () => {
				try {
					const { data } = await axiosInstance.patch(
						`/messages/${lastMessage._id}`,
						{ isDelivered: true },
					);

					if (data.status === "success") {
						setMessages((messages) =>
							messages?.map((message) =>
								message._id === lastMessage._id
									? { ...message, isDelivered: true }
									: message,
							),
						);
					}
				} catch (error) {
					handleErrorToast(error);
				}
			};

			deliverMessage();
		});

		return () => socket?.off("getDelivered");
	}, [socket, setMessages, messages]);
}

export default useListenDeliver;
