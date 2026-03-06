import { useEffect, useMemo, useRef } from "react";

import { useMessagesContext } from "@/contexts/MessagesContext";

import MessageItem from "./ChatMessageItem";
import ChatNoMessages from "./ChatNoMessages";
import ChatDateSeparator from "./ChatDateSeparator";

function isSameCalendarDay(dateA, dateB) {
	const a = new Date(dateA);
	const b = new Date(dateB);

	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

function ChatMessages() {
	const { messages } = useMessagesContext();
	const chatContainerRef = useRef(null);

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

			result.push({
				type: "message",
				id: message._id,
				message,
			});
		});

		return result;
	}, [messages]);

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

						return <MessageItem key={item.id} message={item.message} />;
					})}
				</div>
			)}
		</div>
	);
}

export default ChatMessages;
