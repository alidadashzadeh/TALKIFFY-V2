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

		socket.on("contact:added", handleContactAdded);
		socket.on("message:new", handleNewMessage);
		socket.on("message:delivered", handleMessageDelivered);
		socket.on("message:seen", handleMessageSeen);

		return () => {
			socket.off("contact:added", handleContactAdded);
			socket.off("message:new", handleNewMessage);
			socket.off("message:delivered", handleMessageDelivered);
			socket.off("message:seen", handleMessageSeen);
		};
	}, [socket, queryClient]);
}

export default useSocketListeners;
