import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	createHandleContactAdded,
	createHandleNewMessage,
	createHandleMessageDelivered,
	createHandleMessageSeen,
} from "@/lib/socketHandlers";

function useSocketListeners(socket) {
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!socket) return;

		const handleContactAdded = createHandleContactAdded(queryClient);
		const handleNewMessage = createHandleNewMessage(queryClient);
		const handleMessageDelivered = createHandleMessageDelivered(queryClient);
		const handleMessageSeen = createHandleMessageSeen(queryClient);
		const handleInvalidateConversations = createHandleMessageSeen(queryClient);

		socket.on("contact:added", handleContactAdded);
		socket.on("message:new", handleNewMessage);
		socket.on("message:delivered", handleMessageDelivered);
		socket.on("message:seen", handleMessageSeen);
		socket.on("group:adminAdded", handleInvalidateConversations);
		socket.on("group:adminRemoved", handleInvalidateConversations);
		socket.on("group:memberAdded", handleInvalidateConversations);
		socket.on("group:memberRemoved", handleInvalidateConversations);
		socket.on("group:memberLeft", handleInvalidateConversations);

		return () => {
			socket.off("contact:added", handleContactAdded);
			socket.off("message:new", handleNewMessage);
			socket.off("message:delivered", handleMessageDelivered);
			socket.off("message:seen", handleMessageSeen);
			socket.off("group:adminAdded", handleInvalidateConversations);
			socket.off("group:adminRemoved", handleInvalidateConversations);
			socket.off("group:memberAdded", handleInvalidateConversations);
			socket.off("group:memberRemoved", handleInvalidateConversations);
			socket.off("group:memberLeft", handleInvalidateConversations);
		};
	}, [socket, queryClient]);
}

export default useSocketListeners;
