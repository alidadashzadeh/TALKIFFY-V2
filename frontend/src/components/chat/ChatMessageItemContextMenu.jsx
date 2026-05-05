import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { Reply } from "lucide-react";
import MessageItemCheckMarks from "../message/MessageItemCheckMarks";
import MessageAttachmentImage from "../message/MessageAttachmentImage";
import ReplyMessage from "../message/ReplyMessage";
import { useMessagesContext } from "@/contexts/MessagesContext";
import MessageReactions from "../message/MessageReactions";
import { groupMessageReactions } from "@/lib/utils/messages";

function ChatMessageItemContextMenu({
	message,
	isSeenByOtherUser,
	currentUser,
}) {
	const { setReplyTo, textareaRef } = useMessagesContext();

	const isMyMessage =
		String(message?.senderId?._id) === String(currentUser?._id);

	const hasImageAttachment = message?.attachments?.[0]?.type === "image";

	const handleReply = () => {
		setReplyTo(message);
	};

	const groupedReactions = groupMessageReactions(message?.reactions);

	const messageTime = message?.createdAt
		? new Date(message.createdAt).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})
		: "";
	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
				<div className="group inline-flex max-w-full min-w-0 flex-col">
					<div
						className={cn(
							"relative inline-flex max-w-full min-w-0 flex-col overflow-hidden px-4 py-2 text-sm shadow-lg transition-all duration-200",
							"before:pointer-events-none before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity group-hover:before:opacity-100",
							isMyMessage
								? "rounded-xl rounded-br-sm  bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-primary/20"
								: "rounded-xl rounded-bl-sm border border-border/60 bg-card/90 text-card-foreground shadow-black/5 backdrop-blur-md",
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
							<p className="relative z-10 max-w-full whitespace-pre-wrap break-words leading-relaxed">
								{message.content}
							</p>
						)}

						<div
							className={cn(
								"relative z-10 flex items-center justify-between",
								isMyMessage ? "flex-row" : "flex-row-reverse",
							)}
						>
							<div className="min-w-0">
								{groupedReactions.length > 0 && (
									<MessageReactions
										message={message}
										isMyMessage={isMyMessage}
									/>
								)}
							</div>

							<div
								className={cn(
									" flex shrink-0 items-center gap-1 text-[10px]",
									isMyMessage ? "ml-auto" : "mr-auto",
								)}
							>
								<span>{messageTime}</span>

								{isMyMessage && (
									<MessageItemCheckMarks
										message={message}
										isSeenByOtherUser={isSeenByOtherUser}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</ContextMenuTrigger>

			<ContextMenuContent
				className="min-w-36 rounded-2xl border-border/60 bg-popover/95 p-1.5 shadow-xl backdrop-blur-md"
				onCloseAutoFocus={(e) => {
					e.preventDefault();
					textareaRef?.current?.focus();
				}}
			>
				<ContextMenuItem
					onSelect={handleReply}
					className="cursor-pointer rounded-xl px-3 py-2"
				>
					<Reply className="mr-2 h-4 w-4" />
					Reply
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

export default ChatMessageItemContextMenu;
