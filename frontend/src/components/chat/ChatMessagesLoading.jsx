import { Spinner } from "../ui/spinner";

function ChatMessagesLoading() {
	return (
		<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
			<Spinner />
		</div>
	);
}

export default ChatMessagesLoading;
