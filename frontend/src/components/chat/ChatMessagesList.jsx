import { isBundledMessage } from "@/lib/utils/messages";
import ChatMessageItem from "./ChatMessageItem";
import useMessageSeenTracking from "@/hooks/messages/useMessageSeenTracking";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import { useConversationContext } from "@/contexts/ConversationContext";
import useGetMessages from "@/hooks/messages/useGetMessages";

function ChatMessagesList({ firstUnseenMessageId }) {
	const { messages = [] } = useGetMessages();
	const { currentUser } = useCurrentUser();
	const { currentConversation, targetMessageRef, containerRef } =
		useConversationContext();

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
