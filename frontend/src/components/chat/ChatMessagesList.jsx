import { getMessageGroupsByDate, isBundledMessage } from "@/lib/utils/messages";
import { formatSectionDate } from "@/lib/utils";
import ChatMessageItem from "./ChatMessageItem";
import useMessageSeenTracking from "@/hooks/messages/useMessageSeenTracking";

function ChatMessagesList({
	messages = [],
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

	const messageGroups = getMessageGroupsByDate(messages);

	return (
		<div className="flex w-full flex-col">
			{messageGroups.map(({ dateKey, messages: groupMessages }) => (
				<div key={dateKey} className="flex flex-col">
					<div className="sticky top-0 z-10 mx-auto my-3 w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
						{formatSectionDate(dateKey)}
					</div>

					{groupMessages.map(({ message, index }) => {
						const isBundled = isBundledMessage(messages, index);
						const isTarget =
							String(message._id) === String(firstUnseenMessageId);

						const shouldTrackSeen = getShouldTrackSeen(message, index);

						const isOwnMessage =
							String(message?.senderId?._id) === String(currentUser?._id);

						const isSeenByOtherUser =
							isOwnMessage && index <= otherLastSeenIndex;

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
			))}
		</div>
	);
}

export default ChatMessagesList;
