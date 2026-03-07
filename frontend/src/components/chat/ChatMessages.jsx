import MessageItem from "./ChatMessageItem";
import ChatNoMessages from "./ChatNoMessages";
import { Spinner } from "../ui/spinner";
import useGetMessages from "@/hooks/messages/useGetMessages";

function ChatMessages() {
	const { data: messages = [], isLoading } = useGetMessages();

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="h-full overflow-y-auto px-3 py-4 sm:px-4">
			{!messages?.length ? (
				<ChatNoMessages />
			) : (
				<div className="mx-auto flex w-full max-w-4xl flex-col">
					{messages.map((message) => {
						return <MessageItem key={message._id} message={message} />;
					})}
				</div>
			)}
		</div>
	);
}

export default ChatMessages;
