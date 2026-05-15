const onlineUsersMap = new Map();

export const addUserSocket = (userId, socketId) => {
	const normalizedUserId = String(userId);

	if (!onlineUsersMap.has(normalizedUserId)) {
		onlineUsersMap.set(normalizedUserId, new Set());
	}

	onlineUsersMap.get(normalizedUserId).add(socketId);
};

export const removeUserSocket = (userId, socketId) => {
	const normalizedUserId = String(userId);

	if (!onlineUsersMap.has(normalizedUserId)) return;

	const sockets = onlineUsersMap.get(normalizedUserId);
	sockets.delete(socketId);

	if (sockets.size === 0) {
		onlineUsersMap.delete(normalizedUserId);
	}
};

export const getOnlineUserIds = () => [...onlineUsersMap.keys()];

export const getUserSocketIds = (userId) => {
	const normalizedUserId = String(userId);
	const sockets = onlineUsersMap.get(normalizedUserId);

	if (!sockets || sockets.size === 0) return [];

	return [...sockets];
};
