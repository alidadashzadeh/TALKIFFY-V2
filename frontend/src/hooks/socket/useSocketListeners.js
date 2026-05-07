import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConversationContext } from "@/contexts/ConversationContext";
import useNearBottom from "../conversation/useNearBottom";
import useGroupSocketHandlers from "./handlers/useGroupSocketHandlers";
import useMessageSocketHandlers from "./handlers/useMessageSocketHandlers";
import useContactSocketHandlers from "./handlers/useContactSocketHandlers";

function useSocketListeners(socket) {
	const queryClient = useQueryClient();
	const { bottomRef, containerRef, currentConversation } =
		useConversationContext();
	const isNearBottom = useNearBottom(containerRef);

	const {
		handleNewMessage,
		handleMessageDelivered,
		handleMessageSeen,
		handleMessageReactionUpdated,
	} = useMessageSocketHandlers({
		queryClient,
		currentConversationId: currentConversation?._id,
		bottomRef,
		isNearBottom,
	});
	const handleContactAdded = useContactSocketHandlers(queryClient);
	const {
		handleAdminAdded,
		handleAdminRemoved,
		handleMemberAdded,
		handleMemberRemoved,
		handleMemberLeft,
	} = useGroupSocketHandlers(queryClient);

	useEffect(() => {
		if (!socket) return;

		socket.on("contact:added", handleContactAdded);
		socket.on("message:new", handleNewMessage);
		socket.on("message:delivered", handleMessageDelivered);
		socket.on("message:seen", handleMessageSeen);
		socket.on("message:reactionUpdated", handleMessageReactionUpdated);
		socket.on("group:adminAdded", handleAdminAdded);
		socket.on("group:adminRemoved", handleAdminRemoved);
		socket.on("group:memberAdded", handleMemberAdded);
		socket.on("group:memberRemoved", handleMemberRemoved);
		socket.on("group:memberLeft", handleMemberLeft);

		return () => {
			socket.off("contact:added", handleContactAdded);
			socket.off("message:new", handleNewMessage);
			socket.off("message:delivered", handleMessageDelivered);
			socket.off("message:seen", handleMessageSeen);
			socket.off("message:reactionUpdated", handleMessageReactionUpdated);
			socket.off("group:adminAdded", handleAdminAdded);
			socket.off("group:adminRemoved", handleAdminRemoved);
			socket.off("group:memberAdded", handleMemberAdded);
			socket.off("group:memberRemoved", handleMemberRemoved);
			socket.off("group:memberLeft", handleMemberLeft);
		};
	}, [
		socket,
		handleNewMessage,
		handleContactAdded,
		handleMessageDelivered,
		handleMessageSeen,
		handleMessageReactionUpdated,
		handleAdminAdded,
		handleAdminRemoved,
		handleMemberAdded,
		handleMemberRemoved,
		handleMemberLeft,
	]);
}

export default useSocketListeners;
