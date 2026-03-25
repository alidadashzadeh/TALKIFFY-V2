/* eslint-disable react/prop-types */
import { Reply } from "lucide-react";

import { cn, getMessageDisplayData } from "@/lib/utils";
import { useConversationContext } from "@/contexts/ConversationContext";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import { useMessagesContext } from "@/contexts/MessagesContext";
import MessageItemCheckMarks from "../message/MessageItemCheckMarks";
import MessageAttachmentImage from "../message/MessageAttachmentImage";
import { Muted } from "../ui/typography";
import AvatarGenerator from "../AvatarGenerator";
import ReplyMessage from "../message/ReplyMessage";

function MessageItem({ message, isGroup }) {
	const { data: currentUser } = useCurrentUser();
	const { currentConversation } = useConversationContext();
	const { setReplyTo, textareaRef } = useMessagesContext();

	const isGroupConversation = currentConversation?.type === "group";

	const { isMe, username, avatar } = getMessageDisplayData(
		message,
		currentUser,
	);

	const attachment = message?.attachments?.[0];
	const hasImageAttachment = attachment?.type === "image";

	const formattedTime = new Date(message?.createdAt).toLocaleTimeString(
		"en-US",
		{
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		},
	);

	const handleReply = () => {
		setReplyTo(message);
	};

	return (
		<div className="">
			<div
				className={cn(
					"flex w-full",
					isMe ? "justify-end" : "justify-start",
					isGroup ? "mt-1" : "mt-4",
				)}
			>
				<div
					className={cn(
						"flex max-w-[85%] items-end gap-2 sm:max-w-[75%] lg:max-w-[60%]",
						isMe ? "flex-row-reverse" : "flex-row",
					)}
				>
					<div className="w-8 shrink-0">
						{!isMe && !isGroup ? (
							<AvatarGenerator avatar={avatar} name={username} size="w-8 h-8" />
						) : null}
					</div>

					<div
						className={cn(
							"flex min-w-0 flex-col gap-1",
							isMe ? "items-end" : "items-start",
						)}
					>
						{isGroupConversation && !isGroup && !isMe && (
							<Muted className="px-1 text-xs font-medium">{username}</Muted>
						)}

						<ContextMenu>
							<ContextMenuTrigger asChild>
								<div
									className={cn(
										"inline-flex max-w-full min-w-0 flex-col gap-2 px-3.5 py-2 text-sm shadow-sm",
										isMe
											? "rounded-2xl rounded-br-sm bg-primary text-primary-foreground"
											: "rounded-2xl rounded-bl-sm border bg-background text-foreground",
									)}
								>
									{message?.replyTo && (
										<ReplyMessage replyMessage={message.replyTo} isMe={isMe} />
									)}

									{hasImageAttachment && (
										<MessageAttachmentImage attachment={attachment} />
									)}
									<div className="flex max-w-full items-end gap-1.5">
										<p className="max-w-full whitespace-pre-wrap break-words">
											{message?.content}
										</p>
										{isMe && <MessageItemCheckMarks message={message} />}
									</div>
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
					</div>
				</div>
			</div>
			<Muted
				className={cn(
					"p-1 flex text-xs",
					isMe ? " justify-end pr-10" : "justify-start pl-10",
				)}
			>
				{formattedTime}
			</Muted>
		</div>
	);
}

export default MessageItem;
