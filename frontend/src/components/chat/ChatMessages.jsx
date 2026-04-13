import MessageItem from "./ChatMessageItem";
import ChatNoMessages from "./ChatNoMessages";
import { Spinner } from "../ui/spinner";
import useGetMessages from "@/hooks/messages/useGetMessages";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import useMarkMessagesSeen from "@/hooks/messages/useMarkMessagesSeen";
import {
	useEffect,
	useRef,
	useCallback,
	useMemo,
	useLayoutEffect,
} from "react";
import { useConversationContext } from "@/contexts/ConversationContext";

function ChatMessages() {
	const { messages = [], loading } = useGetMessages();
	const { currentUser } = useCurrentUser();
	const { currentConversation } = useConversationContext();

	const { mutateAsync: markMessagesSeen } = useMarkMessagesSeen();

	const scrollContainerRef = useRef(null);
	const targetMessageRef = useRef(null);
	const bottomRef = useRef(null);

	const didInitialScrollRef = useRef(false);
	const prevLastMessageIdRef = useRef(null);
	const isNearBottomRef = useRef(false);

	const seenTimeoutRef = useRef(null);
	const lastSeenMessageRef = useRef(null);

	const getSenderId = useCallback((msg) => {
		return msg?.senderId?._id || msg?.senderId;
	}, []);

	const myReadState = useMemo(() => {
		return currentConversation?.readState?.find(
			(r) => String(r.userId) === String(currentUser?._id),
		);
	}, [currentConversation?.readState, currentUser?._id]);

	const lastSeenMessageId = myReadState?.lastSeenMessageId || null;

	const lastSeenIndex = useMemo(() => {
		if (!messages.length || !lastSeenMessageId) return -1;

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

	const measureNearBottom = useCallback(() => {
		const container = scrollContainerRef.current;
		if (!container) return false;

		const distanceFromBottom =
			container.scrollHeight - container.scrollTop - container.clientHeight;

		const near = distanceFromBottom <= 200;
		isNearBottomRef.current = near;

		return near;
	}, []);

	const firstUnseenMessageId = useMemo(() => {
		if (!messages.length || !currentUser?._id) return null;

		if (!lastSeenMessageId) {
			return messages[0]?._id || null;
		}

		if (lastSeenIndex === -1) {
			return null;
		}

		return messages[lastSeenIndex + 1]?._id || null;
	}, [messages, currentUser?._id, lastSeenMessageId, lastSeenIndex]);

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
		didInitialScrollRef.current = false;
		prevLastMessageIdRef.current = null;
		isNearBottomRef.current = false;
		targetMessageRef.current = null;
		lastSeenMessageRef.current = null;

		if (seenTimeoutRef.current) {
			clearTimeout(seenTimeoutRef.current);
			seenTimeoutRef.current = null;
		}
	}, [currentConversation?._id]);

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const handleScroll = () => {
			measureNearBottom();
		};

		container.addEventListener("scroll", handleScroll);
		handleScroll();

		return () => {
			container.removeEventListener("scroll", handleScroll);
		};
	}, [measureNearBottom]);

	useLayoutEffect(() => {
		if (!currentConversation?._id) return;
		if (!messages.length) return;
		if (!currentUser?._id) return;
		if (didInitialScrollRef.current) return;

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

		didInitialScrollRef.current = true;
		prevLastMessageIdRef.current = messages[messages.length - 1]?._id || null;

		requestAnimationFrame(() => {
			measureNearBottom();
		});
	}, [
		currentConversation?._id,
		messages,
		currentUser?._id,
		firstUnseenMessageId,
		measureNearBottom,
	]);

	useEffect(() => {
		if (!messages.length) return;
		if (!currentUser?._id) return;
		if (!didInitialScrollRef.current) return;

		const lastMessage = messages[messages.length - 1];
		const lastMessageId = lastMessage?._id || null;
		const prevLastMessageId = prevLastMessageIdRef.current;

		if (!lastMessageId) return;
		if (lastMessageId === prevLastMessageId) return;

		const isOwnLastMessage =
			String(getSenderId(lastMessage)) === String(currentUser._id);

		if (isOwnLastMessage || isNearBottomRef.current) {
			bottomRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});

			requestAnimationFrame(() => {
				measureNearBottom();
			});
		}

		prevLastMessageIdRef.current = lastMessageId;
	}, [messages, currentUser?._id, measureNearBottom, getSenderId]);

	useEffect(() => {
		return () => {
			if (seenTimeoutRef.current) {
				clearTimeout(seenTimeoutRef.current);
			}
		};
	}, []);

	if (loading) {
		return (
			<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
				<Spinner />
			</div>
		);
	}

	return (
		<div
			ref={scrollContainerRef}
			className="h-full overflow-y-auto px-3 py-4 sm:px-4"
		>
			{!messages.length ? (
				<ChatNoMessages />
			) : (
				<div className="flex w-full flex-col px-16">
					{messages.map((message, index) => {
						const prev = messages[index - 1];

						let isGroup = false;

						if (prev) {
							const sameSender =
								String(getSenderId(prev)) === String(getSenderId(message));
							const timeDiff =
								new Date(message.createdAt) - new Date(prev.createdAt);
							const within5min = timeDiff < 5 * 60 * 1000;

							isGroup = sameSender && within5min;
						}

						const isTarget =
							String(message._id) === String(firstUnseenMessageId);

						const isOwnMessage =
							String(getSenderId(message)) === String(currentUser?._id);

						const shouldTrackSeen = !isOwnMessage && index > lastSeenIndex;

						const isSeenByOtherUser =
							isOwnMessage && index <= otherLastSeenIndex;

						return (
							<MessageItem
								key={message._id}
								message={message}
								isGroup={isGroup}
								ref={isTarget ? targetMessageRef : null}
								shouldTrackSeen={shouldTrackSeen}
								onSeen={queueSeenMessage}
								observerRoot={scrollContainerRef.current}
								isSeenByOtherUser={isSeenByOtherUser}
							/>
						);
					})}
					<div ref={bottomRef} />
				</div>
			)}
		</div>
	);
}

export default ChatMessages;
