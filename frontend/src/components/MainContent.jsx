import { useConversationContext } from "@/contexts/ConversationContext";
import NoConversationSelected from "./conversation/NoConversationSelected";
import ChatMessages from "./chat/ChatMessages";
import ChatMessageBar from "./chat/ChatMessageBar";
import GroupInfoSidebar from "./conversation/ConversationInfoSidebar";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";
import { AnimatePresence, motion } from "framer-motion";
import ChatHeader from "./chat/ChatHeader";

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
		<div className="flex h-full w-full">
			<main className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-muted/20">
				<ChatHeader />

				<div className="min-h-0 flex-1">
					<ChatMessages />
				</div>

				<div className="shrink-0 p-3 sm:p-4">
					<div className="w-full">
						<ChatMessageBar />
					</div>
				</div>
			</main>

			<AnimatePresence>
				{conversationInfoOpen && (
					<motion.aside
						initial={{ width: 0, opacity: 0, x: 40 }}
						animate={{ width: 360, opacity: 1, x: 0 }}
						exit={{ width: 0, opacity: 0, x: 40 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						className="h-full overflow-hidden border-l bg-background"
					>
						<div className="w-[360px] h-full">
							<GroupInfoSidebar />
						</div>
					</motion.aside>
				)}
			</AnimatePresence>
		</div>
	);
}

export default MainContent;
