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
	(queryClient) =>
	({ conversationId }) => {
		queryClient.invalidateQueries({
			queryKey: ["conversations"],
		});

		queryClient.invalidateQueries({
			queryKey: ["messages", conversationId],
		});
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
