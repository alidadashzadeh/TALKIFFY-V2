import { isBundledMessage } from "@/lib/utils/messages";
import ChatMessageItem from "./ChatMessageItem";
import useMessageSeenTracking from "@/hooks/messages/useMessageSeenTracking";

function ChatMessagesList({
	messages,
	currentUser,
	currentConversation,
	containerRef,
	targetMessageRef,
	firstUnseenMessageId,
}) {
	const { queueSeenMessage, getShouldTrackSeen, otherLastSeenIndex } =
		useMessageSeenTracking({
			messages,
			currentConversation,
			currentUser,
		});

	return (
		<div className="flex w-full flex-col ">
			{messages?.map((message, index) => {
				const isBundled = isBundledMessage(messages, index);
				const isTarget = String(message._id) === String(firstUnseenMessageId);
				const shouldTrackSeen = getShouldTrackSeen(message, index);
				const isOwnMessage =
					String(message?.senderId?._id) === String(currentUser?._id);
				const isSeenByOtherUser = isOwnMessage && index <= otherLastSeenIndex;

				return (
					<ChatMessageItem
						key={message._id}
						message={message}
						currentUser={currentUser}
						currentConversation={currentConversation}
						isBundled={isBundled}
						targetMessageRef={isTarget ? targetMessageRef : null}
						shouldTrackSeen={shouldTrackSeen}
						onSeen={queueSeenMessage}
						observerRoot={containerRef.current}
						isSeenByOtherUser={isSeenByOtherUser}
					/>
				);
			})}
		</div>
	);
}

export default ChatMessagesList;
