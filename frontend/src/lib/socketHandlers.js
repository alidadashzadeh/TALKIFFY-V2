import { toast } from "sonner";

export const createHandleContactAdded = (queryClient) => (payload) => {
	queryClient.setQueryData(["currentUser"], (oldData) => {
		if (!oldData) return oldData;

		return {
			...oldData,
			contacts: [...oldData.contacts, payload.addedBy],
		};
	});

	toast.success(`New contact: ${payload.addedBy.username}`);
};

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

export const createHandleAdminAdded = (queryClient) => {
	return ({ conversationId, userId }) => {
		queryClient.setQueryData(["conversations"], (oldData) => {
			if (!oldData) return oldData;

			return oldData.map((conversation) => {
				if (String(conversation._id) !== String(conversationId)) {
					return conversation;
				}

				// prevent duplicates
				if (conversation.admins.some((id) => String(id) === String(userId))) {
					return conversation;
				}

				return {
					...conversation,
					admins: [...conversation.admins, userId],
				};
			});
		});
	};
};
export const createHandleAdminRemoved = (queryClient) => {
	return ({ conversationId, userId }) => {
		queryClient.setQueryData(["conversations"], (oldData) => {
			if (!oldData) return oldData;

			return oldData.map((conversation) => {
				if (String(conversation._id) !== String(conversationId)) {
					return conversation;
				}

				return {
					...conversation,
					admins: conversation?.admins.filter(
						(id) => String(id) !== String(userId),
					),
				};
			});
		});
	};
};

export const createHandleMemberAdded = (queryClient) => {
	return ({ conversationId, participant, readStateEntry }) => {
		queryClient.setQueryData(["conversations"], (oldData) => {
			if (!oldData) return oldData;

			return oldData.map((conversation) => {
				if (String(conversation._id) !== String(conversationId)) {
					return conversation;
				}

				const alreadyParticipant = conversation.participants.some(
					(p) => String(p._id) === String(participant._id),
				);

				const alreadyInReadState = conversation.readState.some(
					(r) => String(r.userId) === String(readStateEntry.userId),
				);

				return {
					...conversation,
					participants: alreadyParticipant
						? conversation.participants
						: [...conversation.participants, participant],
					readState: alreadyInReadState
						? conversation.readState
						: [...conversation.readState, readStateEntry],
				};
			});
		});
	};
};
export const createHandleMemberRemoved = (queryClient) => {
	return ({ conversationId, userId }) => {
		queryClient.setQueryData(["conversations"], (oldData) => {
			if (!oldData) return oldData;

			return oldData.map((conversation) => {
				if (String(conversation._id) !== String(conversationId)) {
					return conversation;
				}

				const nextParticipants = conversation.participants.filter(
					(participant) =>
						String(participant?._id || participant) !== String(userId),
				);

				const nextReadState = conversation.readState.filter(
					(r) => String(r.userId?._id || r.userId) !== String(userId),
				);

				const nextAdmins = conversation.admins.filter(
					(admin) => String(admin?._id || admin) !== String(userId),
				);

				return {
					...conversation,
					participants: nextParticipants,
					readState: nextReadState,
					admins: nextAdmins,
				};
			});
		});
	};
};
export const createHandleMemberLeft = (queryClient) => {
	return () => {
		queryClient.invalidateQueries({
			queryKey: ["conversations"],
		});
	};
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
