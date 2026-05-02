import { Spinner } from "../ui/spinner";

function ChatMessagesLoading() {
	return (
		<div className="p-4 pt-16 text-sm text-muted-foreground flex justify-center items-center">
			<Spinner />
			<span className="px-4">Loading Messages...</span>
		</div>
	);
}

export default ChatMessagesLoading;
