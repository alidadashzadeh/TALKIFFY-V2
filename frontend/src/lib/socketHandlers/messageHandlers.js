export const createHandleNewMessage =
	(queryClient, currentConversationId, bottomRef, isNearBottom) =>
	({ conversationId, newMessage }) => {
		// 1. Update messages cache
		queryClient.setQueryData(["messages", conversationId], (oldData) => {
			if (!oldData) return oldData;

			return [...oldData, newMessage];
		});

		// 2. Update conversations cache (last message + ordering)
		queryClient.setQueryData(["conversations"], (oldData) => {
			if (!oldData) return oldData;

			const updated = oldData.map((conv) => {
				if (conv._id !== conversationId) return conv;

				return {
					...conv,
					unreadCount:
						newMessage?.conversationId === currentConversationId && isNearBottom
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

			// move updated convo to top
			return updated.sort(
				(a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
			);
		});

		// 3. Scroll logic
		// Keep scroll here because message:new is the most reliable timing point.
		// useChatScrollBehavior handles initial load; socket handles live messages.
		if (conversationId === currentConversationId && isNearBottom) {
			setTimeout(() => {
				bottomRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "end",
				});
			}, 100);
		}
	};

export const createHandleMessageDelivered =
	(queryClient) =>
	({ messageId, conversationId, deliveredAt }) => {
		queryClient.setQueryData(["messages", conversationId], (oldData) => {
			if (!oldData) return oldData;

			return oldData.map((message) => {
				if (String(message._id) !== String(messageId)) return message;

				return {
					...message,
					isDelivered: true,
					deliveredAt,
				};
			});
		});
	};

export const createHandleMessageSeen =
	(queryClient) =>
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
	};

export const createHandleMessageReactionUpdated = (queryClient) => {
	return ({ conversationId, message }) => {
		queryClient.setQueryData(["messages", conversationId], (oldData) => {
			if (!oldData) return oldData;

			return oldData.map((oldMessage) =>
				String(oldMessage._id) === String(message._id) ? message : oldMessage,
			);
		});
	};
};
