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
	({ conversationId }) => {
		queryClient.invalidateQueries({
			queryKey: ["conversations"],
		});

		queryClient.invalidateQueries({
			queryKey: ["messages", conversationId],
		});
		if (conversationId === currentConversationId && isNearBottom) {
			setTimeout(() => {
				bottomRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "end",
				});
			}, 1000);
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
