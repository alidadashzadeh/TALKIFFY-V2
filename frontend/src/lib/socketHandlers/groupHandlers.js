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
