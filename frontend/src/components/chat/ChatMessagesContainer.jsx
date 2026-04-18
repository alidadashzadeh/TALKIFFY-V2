import { useRef } from "react";
import ChatMessagesList from "./ChatMessagesList";
import useNearBottom from "@/hooks/conversation/useNearBottom";
import useChatScrollBehavior from "@/hooks/conversation/useChatScrollBehavior";

function ChatMessagesContainer({ messages, currentConversation, currentUser }) {
	const containerRef = useRef(null);
	const topRef = useRef(null);
	const bottomRef = useRef(null);
	const targetMessageRef = useRef(null);
	const isNearBottom = useNearBottom(containerRef);
	const { firstUnseenMessageId } = useChatScrollBehavior({
		messages,
		currentConversation,
		currentUser,
		targetMessageRef,
		bottomRef,
		isNearBottom,
	});

	return (
		<div
			ref={containerRef}
			className="h-full overflow-y-auto px-3 py-4 sm:px-4"
		>
			<div className="flex w-full flex-col px-16">
				<div ref={topRef} />

				<ChatMessagesList
					messages={messages}
					currentConversation={currentConversation}
					currentUser={currentUser}
					firstUnseenMessageId={firstUnseenMessageId}
					containerRef={containerRef}
					targetMessageRef={targetMessageRef}
				/>

				<div className="bg-red-500" ref={bottomRef} />
			</div>
		</div>
	);
}
export default ChatMessagesContainer;
