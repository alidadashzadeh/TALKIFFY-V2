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
