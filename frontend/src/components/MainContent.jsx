import { useConversationContext } from "@/contexts/ConversationContext";
import ChatEmptyState from "./chat/ChatEmptyState";
import ChatMessages from "./chat/ChatMessages";
import ChatHeader from "./chat/ChatHeader";
import ChatMessageBar from "./chat/ChatMessageBar";

function MainContent() {
	const { currentConversation } = useConversationContext();

	if (!currentConversation?._id) {
		return (
			<main className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-muted/20">
				<ChatEmptyState />
			</main>
		);
	}

	return (
		<main className=" flex h-full min-h-0 w-full flex-col overflow-hidden bg-muted/20">
			<ChatHeader />

			<div className="min-h-0 flex-1">
				<ChatMessages />
			</div>

			<div className="shrink-0 p-3 sm:p-4">
				<div className="w-full ">
					<ChatMessageBar />
				</div>
			</div>
		</main>
	);
}

export default MainContent;
