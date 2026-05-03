const BUNDLE_WINDOW_MS = 2 * 60 * 1000;

export function isBundledMessage(messages, index) {
	if (!messages || index === 0) return false;

	const current = messages[index];
	const prev = messages[index - 1];

	if (!prev || !current) return false;

	const sameSender =
		String(current?.senderId?._id) === String(prev?.senderId?._id);

	const timeDiff = new Date(current.createdAt) - new Date(prev.createdAt);

	return sameSender && timeDiff < BUNDLE_WINDOW_MS;
}

export function getMessageGroupsByDate(messages = []) {
	const groups = [];

	let currentDateKey = null;

	messages.forEach((message, index) => {
		const dateKey = new Date(message.createdAt).toDateString();

		if (dateKey !== currentDateKey) {
			groups.push({
				dateKey,
				messages: [],
			});

			currentDateKey = dateKey;
		}

		groups[groups.length - 1].messages.push({ message, index });
	});

	return groups;
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

export function groupMessageReactions(reactions) {
	if (!Array.isArray(reactions) || reactions.length === 0) {
		return [];
	}

	const grouped = reactions.reduce((acc, reaction) => {
		const emoji = reaction?.emoji;
		const user = reaction?.userId;

		if (!emoji || !user?._id) return acc;

		if (!acc[emoji]) {
			acc[emoji] = {
				emoji,
				users: [],
			};
		}

		const alreadyAdded = acc[emoji].users.some(
			(existingUser) => String(existingUser._id) === String(user._id),
		);

		if (!alreadyAdded) {
			acc[emoji].users.push(user);
		}

		return acc;
	}, {});

	return Object.values(grouped);
}
