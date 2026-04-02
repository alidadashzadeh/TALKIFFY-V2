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
	const { data: messages = [], isLoading } = useGetMessages();
	const { data: currentUser } = useCurrentUser();
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

	const getSenderId = useCallback(
		(msg) => msg?.senderId?._id || msg?.senderId,
		[],
	);

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

		const first = messages.find(
			(m) => m?.isSeen === false && getSenderId(m) !== currentUser._id,
		);

		return first?._id || null;
	}, [messages, currentUser?._id, getSenderId]);

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

		const isOwnLastMessage = getSenderId(lastMessage) === currentUser._id;

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

	if (isLoading) {
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
							const sameSender = getSenderId(prev) === getSenderId(message);
							const timeDiff =
								new Date(message.createdAt) - new Date(prev.createdAt);
							const within5min = timeDiff < 5 * 60 * 1000;

							isGroup = sameSender && within5min;
						}

						const isTarget = message._id === firstUnseenMessageId;
						const isOwnMessage = getSenderId(message) === currentUser?._id;

						return (
							<MessageItem
								key={message._id}
								message={message}
								isGroup={isGroup}
								ref={isTarget ? targetMessageRef : null}
								shouldTrackSeen={!isOwnMessage && !message.isSeen}
								onSeen={queueSeenMessage}
								observerRoot={scrollContainerRef.current}
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
