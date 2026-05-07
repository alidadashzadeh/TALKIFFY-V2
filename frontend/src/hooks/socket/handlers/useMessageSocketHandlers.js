// hooks/socket/useMessageSocketHandlers.js

import { useCallback } from "react";
import { useSettingContext } from "@/contexts/SettingContext";

function useMessageSocketHandlers({
	queryClient,
	currentConversationId,
	bottomRef,
	isNearBottom,
}) {
	const { sounds, notifSound, soundEnabled } = useSettingContext();

	const handleNewMessage = useCallback(
		({ conversationId, newMessage }) => {
			queryClient.setQueryData(["messages", conversationId], (oldData) => {
				if (!oldData) return oldData;
				return [...oldData, newMessage];
			});

			queryClient.setQueryData(["conversations"], (oldData) => {
				if (!oldData) return oldData;

				const updated = oldData.map((conv) => {
					if (String(conv._id) !== String(conversationId)) return conv;

					return {
						...conv,
						unreadCount:
							String(conversationId) === String(currentConversationId) &&
							isNearBottom
								? conv.unreadCount
								: conv.unreadCount + 1,
						lastMessageId: {
							_id: newMessage?._id,
							content: newMessage?.content,
							senderId: {
								_id: newMessage?.senderId?._id,
								username: newMessage?.senderId?.username,
							},
						},
						lastMessageAt: newMessage.createdAt,
					};
				});

				return updated.sort(
					(a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
				);
			});

			if (soundEnabled && sounds?.[notifSound]?.src) {
				new Audio(sounds[notifSound].src).play().catch(() => {});
			}

			if (
				String(conversationId) === String(currentConversationId) &&
				isNearBottom
			) {
				setTimeout(() => {
					bottomRef.current?.scrollIntoView({
						behavior: "smooth",
						block: "end",
					});
				}, 100);
			}
		},
		[
			queryClient,
			currentConversationId,
			bottomRef,
			isNearBottom,
			sounds,
			notifSound,
			soundEnabled,
		],
	);

	const handleMessageDelivered = useCallback(
		({ messageId, conversationId, deliveredAt }) => {
			queryClient.setQueryData(["messages", conversationId], (oldData) => {
				if (!oldData) return oldData;

				return oldData.map((message) => {
					if (String(message._id) !== String(messageId)) {
						return message;
					}

					return {
						...message,
						isDelivered: true,
						deliveredAt,
					};
				});
			});
		},
		[queryClient],
	);

	const handleMessageSeen = useCallback(
		({ conversationId, userId, lastSeenMessageId, lastSeenAt }) => {
			queryClient.setQueryData(["conversations"], (oldData) => {
				if (!oldData) return oldData;

				return oldData.map((conversation) => {
					if (String(conversation._id) !== String(conversationId)) {
						return conversation;
					}

					const readState = Array.isArray(conversation.readState)
						? conversation.readState
						: [];

					const hasReadState = readState.some(
						(r) => String(r.userId) === String(userId),
					);

					const nextReadState = hasReadState
						? readState.map((r) =>
								String(r.userId) === String(userId)
									? {
											...r,
											lastSeenMessageId,
											lastSeenAt,
										}
									: r,
							)
						: [
								...readState,
								{
									userId,
									lastSeenMessageId,
									lastSeenAt,
								},
							];

					return {
						...conversation,
						readState: nextReadState,
					};
				});
			});
		},
		[queryClient],
	);

	const handleMessageReactionUpdated = useCallback(
		({ conversationId, message }) => {
			queryClient.setQueryData(["messages", conversationId], (oldData) => {
				if (!oldData) return oldData;

				return oldData.map((oldMessage) =>
					String(oldMessage._id) === String(message._id) ? message : oldMessage,
				);
			});
		},
		[queryClient],
	);

	return {
		handleNewMessage,
		handleMessageDelivered,
		handleMessageSeen,
		handleMessageReactionUpdated,
	};
}

export default useMessageSocketHandlers;
