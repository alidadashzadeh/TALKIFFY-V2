import useSeenObserver from "@/hooks/messages/useSeenObserver";
import { cn, getMessageDisplayData } from "@/lib/utils";
import AvatarGenerator from "../AvatarGenerator";
import { Muted } from "../ui/typography";
import ChatMessageItemContextMenu from "./ChatMessageItemContextMenu";
import MessageHoverReactions from "./../message/MessageHoverReactions";
import useReactToMessage from "@/hooks/messages/useReactToMessage";
import { useMessageScroll } from "@/contexts/MessageScrollContext ";

function ChatMessageItem({
	message,
	currentUser,
	currentConversation,
	isBundled,
	targetMessageRef,
	shouldTrackSeen,
	onSeen,
	observerRoot,
	isSeenByOtherUser,
}) {
	const { reactToMessage, loading } = useReactToMessage();
	const { registerMessageRef, highlightedMessageId } = useMessageScroll();
	const isHighlighted = String(highlightedMessageId) === String(message._id);
	const { bubbleRef } = useSeenObserver({
		message,
		shouldTrackSeen,
		onSeen,
		observerRoot,
	});

	const {
		isMe: isMyMessage,
		username,
		avatar,
	} = getMessageDisplayData(message, currentUser);

	const isGroupConversation = currentConversation?.type === "group";

	const handleReact = (emoji, msg) => {
		if (!msg?._id || !currentConversation?._id || loading) return;
		reactToMessage({
			messageId: msg._id,
			emoji,
			conversationId: currentConversation._id,
		});
	};

	return (
		<div
			ref={(node) => registerMessageRef(message._id, node)}
			className={cn(
				"flex w-full",
				"transition-colors",
				isHighlighted && "animate-message-highlight",
				isMyMessage ? "justify-end" : "justify-start",
				isBundled ? "mt-1" : "mt-4",
			)}
		>
			<div
				ref={targetMessageRef}
				className={cn(
					"flex max-w-[85%] items-end gap-2 sm:max-w-[75%] lg:max-w-[60%]",
					isMyMessage ? "flex-row-reverse" : "flex-row",
				)}
			>
				<div className="h-8 w-8 shrink-0">
					{!isMyMessage && !isBundled ? (
						<AvatarGenerator avatar={avatar} name={username} size="w-8 h-8" />
					) : null}
				</div>

				<div
					className={cn(
						"flex min-w-0 flex-col gap-1",
						isMyMessage ? "items-end" : "items-start",
					)}
				>
					{isGroupConversation && !isBundled && !isMyMessage && (
						<Muted className="px-1 text-xs font-medium">{username}</Muted>
					)}

					<div
						ref={bubbleRef}
						className={cn(
							"flex items-end gap-2",
							isMyMessage ? "flex-row-reverse" : "flex-row",
						)}
					>
						<MessageHoverReactions
							isMyMessage={isMyMessage}
							message={message}
							onReact={handleReact}
						>
							<ChatMessageItemContextMenu
								message={message}
								currentUser={currentUser}
								isSeenByOtherUser={isSeenByOtherUser}
							/>
						</MessageHoverReactions>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChatMessageItem;
