import { useConversationContext } from "@/contexts/ConversationContext";
import NoConversationSelected from "./conversation/NoConversationSelected";
import ChatMessages from "./chat/ChatMessages";
import ChatMessageBar from "./chat/ChatMessageBar";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";
import { AnimatePresence } from "framer-motion";
import ChatHeader from "./chat/ChatHeader";
import ConversationSlidingPanel from "./conversation/ConversationSlidingPanel";

function MainContent() {
	const { currentConversation } = useConversationContext();
	const { conversationInfoOpen } = useSheetModalContext();

	if (!currentConversation?._id) {
		return (
			<main className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-muted/20">
				<NoConversationSelected />
			</main>
		);
	}

	return (
		<div className="flex h-full w-full overflow-hidden">
			<main className="flex h-full min-w-0 min-h-0 flex-1 flex-col overflow-hidden bg-muted/20">
				<ChatHeader />

				<div className="min-h-0 flex-1">
					<ChatMessages />
				</div>

				<div className="shrink-0 p-3 sm:p-4">
					<ChatMessageBar />
				</div>
			</main>

			<AnimatePresence initial={false}>
				{conversationInfoOpen && <ConversationSlidingPanel />}
			</AnimatePresence>
		</div>
	);
}

export default MainContent;
