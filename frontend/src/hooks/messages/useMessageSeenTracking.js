import { useCallback, useEffect, useMemo, useRef } from "react";
import useMarkMessagesSeen from "@/hooks/messages/useMarkMessagesSeen";

function useMessageSeenTracking({
	messages,
	currentConversation,
	currentUser,
}) {
	const seenTimeoutRef = useRef(null);
	const lastSeenMessageRef = useRef(null);
	const { markMessagesSeen } = useMarkMessagesSeen();

	const myReadState = useMemo(() => {
		return currentConversation?.readState?.find(
			(r) => String(r.userId) === String(currentUser?._id),
		);
	}, [currentConversation?.readState, currentUser?._id]);

	const lastSeenMessageId = myReadState?.lastSeenMessageId || null;

	const lastSeenIndex = useMemo(() => {
		if (!messages?.length || !lastSeenMessageId) return -1;

		return messages.findIndex(
			(m) => String(m._id) === String(lastSeenMessageId),
		);
	}, [messages, lastSeenMessageId]);

	const otherReadState = currentConversation?.readState?.find(
		(r) => String(r.userId) !== String(currentUser?._id),
	);

	const otherLastSeenMessageId = otherReadState?.lastSeenMessageId || null;

	const otherLastSeenIndex = useMemo(() => {
		if (!otherLastSeenMessageId) return -1;

		return messages.findIndex(
			(m) => String(m._id) === String(otherLastSeenMessageId),
		);
	}, [messages, otherLastSeenMessageId]);

	const queueSeenMessage = useCallback(
		(message) => {
			if (!message?._id || !currentConversation?._id) return;

			lastSeenMessageRef.current = message;

			if (seenTimeoutRef.current) return;

			seenTimeoutRef.current = setTimeout(async () => {
				const lastSeenMessage = lastSeenMessageRef.current;

				if (!lastSeenMessage?._id) {
					seenTimeoutRef.current = null;
					return;
				}

				try {
					await markMessagesSeen({
						conversationId: currentConversation._id,
						lastSeenMessageId: lastSeenMessage._id,
					});
				} catch (error) {
					console.error("Failed to update seen messages", error);
				} finally {
					seenTimeoutRef.current = null;
				}
			}, 500);
		},
		[currentConversation?._id, markMessagesSeen],
	);

	useEffect(() => {
		return () => {
			if (seenTimeoutRef.current) {
				clearTimeout(seenTimeoutRef.current);
			}
		};
	}, []);

	const getShouldTrackSeen = useCallback(
		(message, index) => {
			const isOwnMessage =
				String(message?.senderId?._id) === String(currentUser?._id);

			return !isOwnMessage && index > lastSeenIndex;
		},
		[currentUser?._id, lastSeenIndex],
	);

	return {
		lastSeenIndex,
		queueSeenMessage,
		getShouldTrackSeen,
		otherLastSeenIndex,
	};
}

export default useMessageSeenTracking;
