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
