import { useConversationContext } from "@/contexts/ConversationContext";

function ChatNoMessages() {
	const { currentConversationId } = useConversationContext();

	return (
		<div className="flex items-start justify-center pt-10 text-center">
			<div className="space-y-2">
				<h3 className="text-lg font-medium">No messages yet</h3>
				<p className="text-sm text-muted-foreground">
					Say hi and start the conversation 👋
				</p>
				<p>conversation Id : {currentConversationId}</p>
			</div>
		</div>
	);
}

export default ChatNoMessages;
