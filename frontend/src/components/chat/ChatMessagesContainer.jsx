import ChatMessagesList from "./ChatMessagesList";
import useChatScrollBehavior from "@/hooks/conversation/useChatScrollBehavior";
import ScrollToBottom from "./ScrollToBottom";

function ChatMessagesContainer({
	messages,
	currentUser,
	currentConversation,
	bottomRef,
	targetMessageRef,
	containerRef,
	topRef,
}) {
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

			<ScrollToBottom />
		</div>
	);
}
export default ChatMessagesContainer;
