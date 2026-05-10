import { useCallback } from "react";

function usePrivateConversationSocketHandlers(queryClient) {
	return useCallback(
		(payload) => {
			const newConversation = payload.conversation;

			queryClient.setQueryData(["conversations"], (oldData = []) => {
				const exists = oldData.some(
					(conversation) =>
						String(conversation._id) === String(newConversation._id),
				);

				if (exists) return oldData;

				return [newConversation, ...oldData];
			});
		},
		[queryClient],
	);
}

export default usePrivateConversationSocketHandlers;
