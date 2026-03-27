import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	createHandleContactAdded,
	createHandleNewMessage,
	createHandleMessageDelivered,
} from "@/lib/socketHandlers";

function useSocketListeners(socket) {
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!socket) return;

		const handleContactAdded = createHandleContactAdded(queryClient);
		const handleNewMessage = createHandleNewMessage(queryClient);
		const handleMessageDelivered = createHandleMessageDelivered(queryClient);

		socket.on("contact:added", handleContactAdded);
		socket.on("message:new", handleNewMessage);
		socket.on("message:delivered", handleMessageDelivered);

		return () => {
			socket.off("contact:added", handleContactAdded);
			socket.off("message:new", handleNewMessage);
			socket.off("message:delivered", handleMessageDelivered);
		};
	}, [socket, queryClient]);
}

export default useSocketListeners;
