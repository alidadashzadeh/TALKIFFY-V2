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

function ChatMessageItemContextMenu({ message }) {
	const { currentUser } = useCurrentUser();
	const isMyMessage = message?.senderId?._id === currentUser?._id;
	const hasImageAttachment = message?.attachments?.[0]?.type === "image";
	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
				<div
					// ref={bubbleRef}
					className={cn(
						"inline-flex max-w-full min-w-0 flex-col gap-2 px-3.5 py-2 text-sm shadow-sm",
						isMyMessage
							? "rounded-2xl rounded-br-sm bg-primary text-primary-foreground"
							: "rounded-2xl rounded-bl-sm border bg-background text-foreground",
					)}
				>
					{message?.replyTo && (
						<ReplyMessage replyMessage={message.replyTo} isMe={isMyMessage} />
					)}

					{hasImageAttachment && (
						<MessageAttachmentImage attachment={message?.attachment} />
					)}

					<div className="flex max-w-full items-end gap-1.5">
						<p className="max-w-full whitespace-pre-wrap break-words">
							{message?.content}
						</p>
						{isMyMessage && (
							<MessageItemCheckMarks
								message={message}
								// isSeenByOtherUser={isSeenByOtherUser}
							/>
						)}
					</div>
				</div>
			</ContextMenuTrigger>

			<ContextMenuContent
			// onCloseAutoFocus={(e) => {
			// 	e.preventDefault();
			// 	textareaRef?.current?.focus();
			// }}
			>
				{/* <ContextMenuItem onSelect={handleReply}> */}
				<ContextMenuItem>
					<Reply className="mr-2 h-4 w-4" />
					Reply
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

export default ChatMessageItemContextMenu;
