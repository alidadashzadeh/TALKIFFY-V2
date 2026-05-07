// hooks/socket/useGroupSocketHandlers.js

import { useCallback } from "react";

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
		({ conversationId, participant, readStateEntry }) => {
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

	return {
		handleAdminAdded,
		handleAdminRemoved,
		handleMemberAdded,
		handleMemberRemoved,
		handleMemberLeft,
	};
}

export default useGroupSocketHandlers;
