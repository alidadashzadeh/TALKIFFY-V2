import { useEffect, useMemo, useRef } from "react";

import { useConversationContext } from "@/contexts/ConversationContext";
import { useMessagesContext } from "@/contexts/MessagesContext";

import MessageItem from "./ChatMessageItem";
import ChatNoMessages from "./ChatNoMessages";
import ChatDateSeparator from "./ChatDateSeparator";

import { isSameCalendarDay } from "@/lib/utils";
import useGetMessages from "@/hooks/useGetMessages";

function ChatMessages() {
	const { currentConversationId } = useConversationContext();
	const { messages, setMessages } = useMessagesContext();

	const chatContainerRef = useRef(null);
	const { messages: fetchedMessages, loading } = useGetMessages(
		currentConversationId,
	);

	useEffect(() => {
		if (fetchedMessages) {
			setMessages(fetchedMessages);
		}
	}, [fetchedMessages, setMessages]);

	useEffect(() => {
		const container = chatContainerRef.current;

		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	}, [messages]);

	const items = useMemo(() => {
		if (!messages?.length) return [];

		const result = [];

		messages.forEach((message, index) => {
			const prevMessage = messages[index - 1];

			const showDateSeparator =
				!prevMessage ||
				!isSameCalendarDay(prevMessage.createdAt, message.createdAt);

			if (showDateSeparator) {
				result.push({
					type: "separator",
					id: `separator-${message._id}`,
					date: message.createdAt,
				});
			}

			const isGrouped =
				!!prevMessage &&
				isSameCalendarDay(prevMessage.createdAt, message.createdAt) &&
				prevMessage.senderId === message.senderId &&
				new Date(message.createdAt) - new Date(prevMessage.createdAt) <
					5 * 60 * 1000;

			result.push({
				type: "message",
				id: message._id,
				message,
				isGrouped,
			});
		});

		return result;
	}, [messages]);

	if (!currentConversationId) {
		return <ChatNoMessages />;
	}

	if (loading) {
		return (
			<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
				Loading messages...
			</div>
		);
	}

	return (
		<div
			ref={chatContainerRef}
			className="h-full overflow-y-auto px-3 py-4 sm:px-4"
		>
			{!messages?.length ? (
				<ChatNoMessages />
			) : (
				<div className="mx-auto flex w-full max-w-4xl flex-col">
					{items.map((item) => {
						if (item.type === "separator") {
							return <ChatDateSeparator key={item.id} date={item.date} />;
						}

						return (
							<MessageItem
								key={item.id}
								message={item.message}
								isGrouped={item.isGrouped}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default ChatMessages;
