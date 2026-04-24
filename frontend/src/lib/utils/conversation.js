import { formatDateKey } from "../utils";

export function filterConversations({
	conversations = [],
	search = "",
	currentUserId,
}) {
	const normalizedFilter = search.trim().toLowerCase();

	if (!normalizedFilter) return conversations;

	return conversations.filter((conversation) => {
		if (conversation?.type === "private") {
			const otherUser = conversation?.participants?.find(
				(participant) => participant?._id !== currentUserId,
			);

			return [otherUser?.username, otherUser?.email].some((value) =>
				value?.toLowerCase().includes(normalizedFilter),
			);
		}

		return conversation?.name?.toLowerCase().includes(normalizedFilter);
	});
}

export function getAttachmentsByDate({ messages }) {
	const result = {};

	for (const message of messages) {
		if (!message?.attachments?.length) continue;

		const dateKey = formatDateKey(message.createdAt);

		if (!result[dateKey]) {
			result[dateKey] = [];
		}

		message.attachments.forEach((attachment, index) => {
			result[dateKey].push({
				...attachment,
				messageId: message._id,
				createdAt: message.createdAt,
				fallbackKey: `${message._id}-${attachment._id || index}`,
			});
		});
	}

	return result;
}
