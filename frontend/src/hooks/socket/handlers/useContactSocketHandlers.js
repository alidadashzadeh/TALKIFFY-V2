import { useCallback } from "react";
import { toast } from "sonner";

function useContactSocketHandlers(queryClient) {
	return useCallback(
		(payload) => {
			queryClient.setQueryData(["currentUser"], (oldData) => {
				if (!oldData) return oldData;

				return {
					...oldData,
					contacts: [...oldData.contacts, payload.addedBy],
				};
			});

			toast.success(`New contact: ${payload.addedBy.username}`);
		},
		[queryClient],
	);
}

export default useContactSocketHandlers;
