import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	createHandleContactAdded,
	createHandleNewMessage,
	createHandleMessageDelivered,
	createHandleMessageSeen,
	createHandleAdminAdded,
	createHandleAdminRemoved,
	createHandleMemberAdded,
	createHandleMemberRemoved,
	createHandleMemberLeft,
	createHandleMessageReactionUpdated,
} from "@/lib/socketHandlers";
import { useConversationContext } from "@/contexts/ConversationContext";
import useNearBottom from "../conversation/useNearBottom";

function useSocketListeners(socket) {
	const queryClient = useQueryClient();
	const { bottomRef, containerRef, currentConversation } =
		useConversationContext();
	const isNearBottom = useNearBottom(containerRef);

	useEffect(() => {
		if (!socket) return;

		const handleContactAdded = createHandleContactAdded(queryClient);
		const handleNewMessage = createHandleNewMessage(
			queryClient,
			currentConversation?._id,
			bottomRef,
			isNearBottom,
		);
		const handleMessageDelivered = createHandleMessageDelivered(queryClient);
		const handleMessageSeen = createHandleMessageSeen(queryClient);

		const handleAdminAdded = createHandleAdminAdded(queryClient);
		const handleAdminRemoved = createHandleAdminRemoved(queryClient);
		const handleMemberAdded = createHandleMemberAdded(queryClient);
		const handleMemberRemoved = createHandleMemberRemoved(queryClient);
		const handleMemberLeft = createHandleMemberLeft(queryClient);

		const handleMessageReactionUpdated =
			createHandleMessageReactionUpdated(queryClient);

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
	}, [socket, queryClient, currentConversation?._id, bottomRef, isNearBottom]);
}

export default useSocketListeners;
