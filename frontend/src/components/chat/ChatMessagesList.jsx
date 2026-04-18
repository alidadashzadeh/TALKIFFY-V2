import { isBundledMessage } from "@/lib/utils/messages";
import ChatMessageItem from "./ChatMessageItem";
import { getMessageSenderId } from "@/lib/utils";

function ChatMessagesList({
	messages,
	currentConversation,
	currentUser,
	firstUnseenMessageId,
	containerRef,
	targetMessageRef,
}) {
	return (
		<div className="flex w-full flex-col ">
			{messages?.map((message, index) => {
				const isBundled = isBundledMessage(messages, index);
				const isTarget = String(message._id) === String(firstUnseenMessageId);

				return (
					<ChatMessageItem
						key={message._id}
						message={message}
						containerRef={containerRef}
						isBundled={isBundled}
						targetMessageRef={isTarget ? targetMessageRef : null}
					/>
				);
			})}
		</div>
	);
}

export default ChatMessagesList;
