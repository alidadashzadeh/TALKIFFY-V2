import ChatMessagesList from "./ChatMessagesList";
import useChatScrollBehavior from "@/hooks/conversation/useChatScrollBehavior";
import useGetMessages from "@/hooks/messages/useGetMessages";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import { useConversationContext } from "@/contexts/ConversationContext";
import useNearBottom from "@/hooks/conversation/useNearBottom";
import ScrollToBottomArrow from "./ScrollToBottomArrow";

function ChatMessagesContainer() {
	const { messages = [] } = useGetMessages();
	const { currentUser } = useCurrentUser();
	const {
		currentConversation,
		containerRef,
		targetMessageRef,
		bottomRef,
		topRef,
	} = useConversationContext();

	const isNearBottom = useNearBottom(containerRef);

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
						currentUser={currentUser}
						currentConversation={currentConversation}
						containerRef={containerRef}
						targetMessageRef={targetMessageRef}
						firstUnseenMessageId={firstUnseenMessageId}
					/>

					<div className="h-px" ref={bottomRef} />
				</div>
			</div>

			{currentConversation && !isNearBottom && <ScrollToBottomArrow />}
		</div>
	);
}
export default ChatMessagesContainer;
