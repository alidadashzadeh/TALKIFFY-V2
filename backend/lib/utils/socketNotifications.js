// utils/socket.utils.js
import { getUserSocketIds } from "../socket.js";

const normalizeId = (id) => id?.toString();

export const getSocketIdsForUsers = (userIds = [], options = {}) => {
	const { excludeUserIds = [] } = options;

	const excluded = new Set(excludeUserIds.map(normalizeId));
	const uniqueUserIds = [
		...new Set(userIds.map(normalizeId).filter(Boolean)),
	].filter((userId) => !excluded.has(userId));

	const socketIds = uniqueUserIds.flatMap(
		(userId) => getUserSocketIds(userId) || [],
	);

	return [...new Set(socketIds)];
};

export const emitToUsers = ({
	io,
	userIds = [],
	event,
	payload,
	excludeUserIds = [],
}) => {
	if (!io || !event) return [];

	const socketIds = getSocketIdsForUsers(userIds, { excludeUserIds });

	socketIds.forEach((socketId) => {
		io.to(socketId).emit(event, payload);
	});

	return socketIds;
};

export const emitToConversationParticipants = ({
	io,
	conversation,
	event,
	payload,
	excludeUserIds = [],
}) => {
	if (!conversation?.participants?.length) return [];

	const participantIds = conversation.participants.map((p) =>
		typeof p === "object" ? p._id || p.userId || p : p,
	);

	return emitToUsers({
		io,
		userIds: participantIds,
		event,
		payload,
		excludeUserIds,
	});
};
