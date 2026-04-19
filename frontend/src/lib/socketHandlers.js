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
	({ conversationId }) => {
		queryClient.invalidateQueries({
			queryKey: ["conversations"],
		});

		queryClient.invalidateQueries({
			queryKey: ["messages", conversationId],
		});
	};

export const createHandleMessageSeen = (queryClient) => {
	return (payload) => {
		const { conversationId } = payload;

		queryClient.invalidateQueries({
			queryKey: ["conversations"],
		});

		queryClient.invalidateQueries({
			queryKey: ["messages", conversationId],
		});
	};
};

export const createHandleInvalidateConversations = (queryClient) => {
	return (payload) => {
		const { conversationId } = payload;

		queryClient.invalidateQueries({
			queryKey: ["conversations"],
		});

		queryClient.invalidateQueries({
			queryKey: ["messages", conversationId],
		});
	};
};
