import ChatMessagesList from "./ChatMessagesList";
import useChatScrollBehavior from "@/hooks/conversation/useChatScrollBehavior";
import { useConversationContext } from "@/contexts/ConversationContext";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import useGetMessages from "@/hooks/messages/useGetMessages";
import ScrollToBottom from "./ScrollToBottom";

function ChatMessagesContainer() {
	const { messages = [] } = useGetMessages();
	const { currentUser } = useCurrentUser();
	const {
		currentConversation,
		bottomRef,
		targetMessageRef,
		containerRef,
		topRef,
	} = useConversationContext();

	const { firstUnseenMessageId } = useChatScrollBehavior({
		messages,
		currentConversation,
		currentUser,
		targetMessageRef,
		bottomRef,
	});

	return (
		<div className="relative h-full">
			<div
				ref={containerRef}
				className="h-full overflow-y-auto px-3 py-4 sm:px-4"
			>
				<div className="flex w-full flex-col px-16">
					<div ref={topRef} />

					<ChatMessagesList
						messages={messages}
						firstUnseenMessageId={firstUnseenMessageId}
					/>

					<div className="h-px" ref={bottomRef} />
				</div>
			</div>

			<ScrollToBottom />
		</div>
	);
}
export default ChatMessagesContainer;
