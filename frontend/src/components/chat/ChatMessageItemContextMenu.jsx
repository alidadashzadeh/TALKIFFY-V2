import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import { cn } from "@/lib/utils";
import { Reply } from "lucide-react";
import MessageItemCheckMarks from "../message/MessageItemCheckMarks";
import MessageAttachmentImage from "../message/MessageAttachmentImage";
import ReplyMessage from "../message/ReplyMessage";
import { useMessagesContext } from "@/contexts/MessagesContext";
import AvatarGenerator from "../AvatarGenerator";
import { useMemo } from "react";
import MessageReactions from "../message/MessageReactions";

function ChatMessageItemContextMenu({ message, isSeenByOtherUser }) {
	const { setReplyTo, textareaRef } = useMessagesContext();
	const { currentUser } = useCurrentUser();

	const isMyMessage =
		String(message?.senderId?._id) === String(currentUser?._id);
	const hasImageAttachment = message?.attachments?.[0]?.type === "image";

	const handleReply = () => {
		setReplyTo(message);
	};

	const groupedReactions = useMemo(() => {
		if (!Array.isArray(message?.reactions) || message.reactions.length === 0) {
			return [];
		}

		const grouped = message.reactions.reduce((acc, reaction) => {
			const emoji = reaction?.emoji;
			const user = reaction?.userId;

			if (!emoji || !user?._id) return acc;

			if (!acc[emoji]) {
				acc[emoji] = {
					emoji,
					users: [],
				};
			}

			const alreadyAdded = acc[emoji].users.some(
				(existingUser) => String(existingUser._id) === String(user._id),
			);

			if (!alreadyAdded) {
				acc[emoji].users.push(user);
			}

			return acc;
		}, {});

		return Object.values(grouped);
	}, [message?.reactions]);

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
				<div className="inline-flex max-w-full min-w-0 flex-col">
					<div
						className={cn(
							"inline-flex max-w-full min-w-0 flex-col gap-2 px-3.5 py-2 text-sm shadow-2xl",
							isMyMessage
								? "rounded-xl rounded-br-sm bg-primary text-primary-foreground"
								: "rounded-xl rounded-bl-sm bg-background text-foreground",
						)}
					>
						{message?.replyTo && (
							<ReplyMessage
								replyMessage={message?.replyTo}
								isMe={isMyMessage}
							/>
						)}

						{hasImageAttachment && (
							<MessageAttachmentImage attachment={message?.attachments?.[0]} />
						)}

						{!!message?.content && (
							<div className="flex max-w-full items-end gap-1.5">
								<p className="max-w-full whitespace-pre-wrap break-words">
									{message.content}
								</p>

								{isMyMessage && (
									<MessageItemCheckMarks
										message={message}
										isSeenByOtherUser={isSeenByOtherUser}
									/>
								)}
							</div>
						)}

						{!message?.content && isMyMessage && (
							<div className="flex justify-end">
								<MessageItemCheckMarks
									message={message}
									isSeenByOtherUser={isSeenByOtherUser}
								/>
							</div>
						)}
					</div>

					{groupedReactions.length > 0 && (
						<MessageReactions message={message} isMyMessage={isMyMessage} />
					)}
				</div>
			</ContextMenuTrigger>

			<ContextMenuContent
				onCloseAutoFocus={(e) => {
					e.preventDefault();
					textareaRef?.current?.focus();
				}}
			>
				<ContextMenuItem onSelect={handleReply}>
					<Reply className="mr-2 h-4 w-4" />
					Reply
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

export default ChatMessageItemContextMenu;
