const BUNDLE_WINDOW_MS = 5 * 60 * 1000;

export function isBundledMessage(messages, index) {
	if (!messages || index === 0) return false;

	const current = messages[index];
	const prev = messages[index - 1];

	if (!prev || !current) return false;

	const sameSender = String(current?.senderId) === String(prev?.senderId);

	const timeDiff = new Date(current.createdAt) - new Date(prev.createdAt);

	return sameSender && timeDiff < BUNDLE_WINDOW_MS;
}

export function getFirstUnseenMessageId({
	messages,
	currentConversation,
	currentUser,
}) {
	if (!messages?.length) return null;

	const myReadState = currentConversation?.readState?.find(
		(r) => String(r.userId) === String(currentUser?._id),
	);

	const lastSeenMessageId = myReadState?.lastSeenMessageId || null;

	const lastSeenMessageIndex = messages.findIndex(
		(m) => String(m._id) === String(lastSeenMessageId),
	);

	return messages[lastSeenMessageIndex + 1]?._id || null;
}
