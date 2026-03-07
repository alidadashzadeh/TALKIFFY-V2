import MessageItem from "./ChatMessageItem";
import ChatNoMessages from "./ChatNoMessages";
import { Spinner } from "../ui/spinner";
import useGetMessages from "@/hooks/messages/useGetMessages";
import { useEffect, useRef } from "react";

function ChatMessages() {
	const { data: messages = [], isLoading } = useGetMessages();
	const bottomRef = useRef(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({
			behavior: "auto",
		});
	}, [messages]);

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
				<Spinner />
			</div>
		);
	}

	const getSenderId = (msg) => msg?.senderId?._id || msg?.senderId;

	return (
		<div className="h-full overflow-y-auto px-3 py-4 sm:px-4">
			{!messages?.length ? (
				<ChatNoMessages />
			) : (
				<div className="mx-auto flex w-full max-w-4xl flex-col">
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

						return (
							<MessageItem
								key={message._id}
								message={message}
								isGroup={isGroup}
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
