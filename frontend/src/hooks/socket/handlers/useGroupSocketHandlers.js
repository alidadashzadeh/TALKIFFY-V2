import { useCallback } from "react";
import { toast } from "sonner";

function useGroupSocketHandlers(queryClient) {
	const handleAdminAdded = useCallback(
		({ conversationId, userId }) => {
			queryClient.setQueryData(["conversations"], (oldData) => {
				if (!oldData) return oldData;

				return oldData.map((conversation) => {
					if (String(conversation._id) !== String(conversationId)) {
						return conversation;
					}

					if (conversation.admins.some((id) => String(id) === String(userId))) {
						return conversation;
					}

					return {
						...conversation,
						admins: [...conversation.admins, userId],
					};
				});
			});
		},
		[queryClient],
	);

	const handleAdminRemoved = useCallback(
		({ conversationId, userId }) => {
			queryClient.setQueryData(["conversations"], (oldData) => {
				if (!oldData) return oldData;

				return oldData.map((conversation) => {
					if (String(conversation._id) !== String(conversationId)) {
						return conversation;
					}

					return {
						...conversation,
						admins: conversation.admins.filter(
							(id) => String(id) !== String(userId),
						),
					};
				});
			});
		},
		[queryClient],
	);

	const handleMemberAdded = useCallback(
		({ conversation }) => {
			queryClient.setQueryData(["conversations"], (oldData) => {
				if (!oldData) return oldData;

				return oldData.map((oldConversation) =>
					String(oldConversation._id) === String(conversation._id)
						? conversation
						: oldConversation,
				);
			});
		},
		[queryClient],
	);

	const handleMemberRemoved = useCallback(
		({ conversationId, userId }) => {
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
		},
		[queryClient],
	);

	const handleMemberLeft = useCallback(() => {
		queryClient.invalidateQueries({
			queryKey: ["conversations"],
		});
	}, [queryClient]);

	const handleAddedToGroup = useCallback(
		({ conversation }) => {
			queryClient.setQueryData(["conversations"], (oldData = []) => {
				const exists = oldData.some(
					(c) => String(c._id) === String(conversation._id),
				);

				if (exists) return oldData;

				return [conversation, ...oldData];
			});
			toast.success(`You were added to "${conversation.name}"`);
		},
		[queryClient],
	);

	const handleRemovedFromGroup = useCallback(
		({ conversationId }) => {
			queryClient.setQueryData(["conversations"], (oldData = []) => {
				const conversation = oldData.find(
					(c) => String(c._id) === String(conversationId),
				);

				if (conversation) {
					toast.info(
						`You were removed from "${conversation.name || "a group"}"`,
					);
				}

				return oldData.filter((c) => String(c._id) !== String(conversationId));
			});
		},
		[queryClient],
	);

	return {
		handleAdminAdded,
		handleAdminRemoved,
		handleMemberAdded,
		handleMemberRemoved,
		handleMemberLeft,
		handleAddedToGroup,
		handleRemovedFromGroup,
	};
}

export default useGroupSocketHandlers;
