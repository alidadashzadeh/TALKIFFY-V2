import { useEffect, useLayoutEffect, useState } from "react";
import { getFirstUnseenMessageId } from "@/lib/utils/messages";

function useChatScrollBehavior({
	messages,
	currentConversation,
	currentUser,
	targetMessageRef,
	bottomRef,
	isNearBottom,
}) {
	const [prevLastMessageId, setPrevLastMessageId] = useState(null);
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

	const lastMessage = messages[messages.length - 1] || null;
	const lastMessageId = lastMessage?._id || null;

	// console.log(
	// 	"prev",
	// 	messages.find((m) => m?._id === prevLastMessageId)?.content,
	// );

	const isOwnLastMessage =
		String(lastMessage?.senderId?._id) === String(currentUser?._id);

	const isFirstSync = prevLastMessageId === null && !!lastMessageId;

	const isNewLastMessage =
		!isFirstSync &&
		!!lastMessageId &&
		String(prevLastMessageId) !== String(lastMessageId);

	// on new message send - scroll to bottom
	useEffect(() => {
		if (!messages?.length) return;
		if (!didInitialScroll) return;
		if (!isOwnLastMessage) return;
		if (!firstUnseenMessageId) return;
		bottomRef.current?.scrollIntoView({
			behavior: "auto",
			block: "end",
		});
		setPrevLastMessageId(lastMessageId);
	}, [
		messages,
		didInitialScroll,
		isOwnLastMessage,
		bottomRef,
		lastMessage,
		lastMessageId,
		firstUnseenMessageId,
	]);

	// on new message received - scroll to bottom if near bottom, else do nothing
	useEffect(() => {
		if (!messages?.length) return;
		if (!didInitialScroll) return;
		if (!isNearBottom) return;
		if (firstUnseenMessageId) return;

		bottomRef.current?.scrollIntoView({
			behavior: "auto",
			block: "end",
		});
		setPrevLastMessageId(lastMessageId);
	}, [
		messages,
		didInitialScroll,
		isNearBottom,
		bottomRef,
		lastMessageId,
		isOwnLastMessage,
		firstUnseenMessageId,
	]);

	// only run on conversation change or first load
	useLayoutEffect(() => {
		if (!messages?.length) return;
		if (didInitialScroll) return;

		if (firstUnseenMessageId && targetMessageRef.current) {
			targetMessageRef.current.scrollIntoView({
				behavior: "auto",
				block: "center",
			});
		} else {
			bottomRef.current?.scrollIntoView({
				behavior: "auto",
				block: "end",
			});
		}

		setInitialScrolledConversationId(conversationId);

		if (lastMessageId) {
			setPrevLastMessageId(lastMessageId);
		}
	}, [
		messages?.length,
		firstUnseenMessageId,
		didInitialScroll,
		conversationId,
		lastMessageId,
		bottomRef,
		targetMessageRef,
	]);

	// function markLastMessageHandled() {
	// 	if (!lastMessageId) return;
	// 	setPrevLastMessageId(lastMessageId);
	// }

	return {
		firstUnseenMessageId,
		lastMessageId,
		isFirstSync,
		isNewLastMessage,
		isOwnLastMessage,
		didInitialScroll,
		// markLastMessageHandled,
	};
}

export default useChatScrollBehavior;
