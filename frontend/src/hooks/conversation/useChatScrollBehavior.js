import { useLayoutEffect, useState } from "react";
import { getFirstUnseenMessageId } from "@/lib/utils/messages";

function useChatScrollBehavior({
	messages,
	currentConversation,
	currentUser,
	targetMessageRef,
	bottomRef,
}) {
	const [initialScrolledConversationId, setInitialScrolledConversationId] =
		useState(null);
	const firstUnseenMessageId = getFirstUnseenMessageId({
		messages,
		currentConversation,
		currentUser,
	});

	const conversationId = currentConversation?._id || null;

	const didInitialScroll =
		String(initialScrolledConversationId) === String(conversationId);

	useLayoutEffect(() => {
		if (!messages?.length) return;
		if (didInitialScroll) return;
		if (!conversationId) return;

		if (firstUnseenMessageId) {
			if (!targetMessageRef.current) return;

			targetMessageRef.current.scrollIntoView({
				behavior: "auto",
				block: "center",
			});

			setInitialScrolledConversationId(conversationId);
			return;
		}

		if (!bottomRef.current) return;

		bottomRef.current.scrollIntoView({
			behavior: "auto",
			block: "end",
		});
		setInitialScrolledConversationId(conversationId);
	}, [
		messages?.length,
		firstUnseenMessageId,
		didInitialScroll,
		conversationId,
		bottomRef,
		targetMessageRef,
	]);

	return {
		firstUnseenMessageId,
		didInitialScroll,
	};
}

export default useChatScrollBehavior;
