// hooks/socket/useMessageSocketHandlers.js

import { useCallback } from "react";
import { useSettingContext } from "@/contexts/SettingContext";
import useCurrentUser from "@/hooks/user/useCurrentUser";

function useMessageSocketHandlers({
	queryClient,
	currentConversationId,
	bottomRef,
	isNearBottom,
}) {
	const { sounds, notifSound, soundEnabled } = useSettingContext();
	const { currentUser } = useCurrentUser();

	const handleNewMessage = useCallback(
		({ conversationId, newMessage, clientTempId }) => {
			let shouldTreatAsNewEvent = true;

			const isMyMessage =
				String(newMessage?.senderId?._id || newMessage?.senderId) ===
				String(currentUser?._id);

			queryClient.setQueryData(["messages", conversationId], (oldData) => {
				// Conversation messages were never loaded.
				// Do not create the messages cache here, but still treat socket event as new.
				if (!oldData) {
					shouldTreatAsNewEvent = true;
					return oldData;
				}

				const existsById = oldData.some(
					(msg) =>
						msg?._id &&
						newMessage?._id &&
						String(msg._id) === String(newMessage._id),
				);

				const existsByClientTempId =
					clientTempId &&
					oldData.some(
						(msg) =>
							msg?.clientTempId &&
							String(msg.clientTempId) === String(clientTempId),
					);

				if (existsById || existsByClientTempId) {
					shouldTreatAsNewEvent = false;
					return oldData;
				}

				return [...oldData, newMessage];
			});

			queryClient.setQueryData(["conversations"], (oldData) => {
				if (!oldData) return oldData;

				const updated = oldData.map((conv) => {
					if (String(conv._id) !== String(conversationId)) return conv;

					const isCurrentOpenConversation =
						String(conversationId) === String(currentConversationId);

					const shouldIncreaseUnread =
						shouldTreatAsNewEvent && !isMyMessage && !isCurrentOpenConversation;

					return {
						...conv,

						unreadCount: shouldIncreaseUnread
							? (conv.unreadCount || 0) + 1
							: conv.unreadCount || 0,

						lastMessageId: {
							_id: newMessage?._id,
							content: newMessage?.content,
							attachments: newMessage?.attachments,
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

			if (
				shouldTreatAsNewEvent &&
				!isMyMessage &&
				soundEnabled &&
				sounds?.[notifSound]?.src
			) {
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
			currentUser?._id,
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
