/* eslint-disable react/prop-types */
import { forwardRef, useEffect, useRef } from "react";
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

const MessageItem = forwardRef(function MessageItem(
	{ message, isGroup, shouldTrackSeen = false, onSeen, observerRoot = null },
	forwardedRef,
) {
	const { data: currentUser } = useCurrentUser();
	const { currentConversation } = useConversationContext();
	const { setReplyTo, textareaRef } = useMessagesContext();

	const localRef = useRef(null);
	const bubbleRef = useRef(null);

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

	useEffect(() => {
		if (!shouldTrackSeen) return;
		if (!bubbleRef.current) return;

		const node = bubbleRef.current;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];

				if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
					onSeen?.(message);
					observer.unobserve(node);
				}
			},
			{
				root: observerRoot,
				threshold: [0.6],
			},
		);

		observer.observe(node);

		return () => {
			observer.disconnect();
		};
	}, [message._id, onSeen, observerRoot, shouldTrackSeen]);

	const setRefs = (node) => {
		localRef.current = node;

		if (typeof forwardedRef === "function") {
			forwardedRef(node);
		} else if (forwardedRef) {
			forwardedRef.current = node;
		}
	};

	return (
		<div ref={setRefs}>
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
									ref={bubbleRef}
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
					"flex p-1 text-xs",
					isMe ? "justify-end pr-10" : "justify-start pl-10",
				)}
			>
				{formattedTime}
			</Muted>
		</div>
	);
});

export default MessageItem;

// /* eslint-disable react/prop-types */
// import { forwardRef, useEffect, useRef } from "react";
// import { Reply } from "lucide-react";

// import { cn, getMessageDisplayData } from "@/lib/utils";
// import { useConversationContext } from "@/contexts/ConversationContext";
// import {
// 	ContextMenu,
// 	ContextMenuContent,
// 	ContextMenuItem,
// 	ContextMenuTrigger,
// } from "@/components/ui/context-menu";
// import useCurrentUser from "@/hooks/user/useCurrentUser";
// import { useMessagesContext } from "@/contexts/MessagesContext";
// import MessageItemCheckMarks from "../message/MessageItemCheckMarks";
// import MessageAttachmentImage from "../message/MessageAttachmentImage";
// import { Muted } from "../ui/typography";
// import AvatarGenerator from "../AvatarGenerator";
// import ReplyMessage from "../message/ReplyMessage";

// const MessageItem = forwardRef(function MessageItem(
// 	{ message, isGroup, shouldTrackSeen = false, onSeen, observerRoot = null },
// 	forwardedRef,
// ) {
// 	const { data: currentUser } = useCurrentUser();
// 	const { currentConversation } = useConversationContext();
// 	const { setReplyTo, textareaRef } = useMessagesContext();

// 	const localRef = useRef(null);

// 	const isGroupConversation = currentConversation?.type === "group";
// 	const { isMe, username, avatar } = getMessageDisplayData(
// 		message,
// 		currentUser,
// 	);

// 	const attachment = message?.attachments?.[0];
// 	const hasImageAttachment = attachment?.type === "image";

// 	const formattedTime = new Date(message?.createdAt).toLocaleTimeString(
// 		"en-US",
// 		{
// 			hour: "2-digit",
// 			minute: "2-digit",
// 			hour12: true,
// 		},
// 	);

// 	const handleReply = () => {
// 		setReplyTo(message);
// 	};

// 	useEffect(() => {
// 		if (!shouldTrackSeen) return;
// 		if (!localRef.current) return;

// 		const node = localRef.current;

// 		const observer = new IntersectionObserver(
// 			(entries) => {
// 				const entry = entries[0];

// 				if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
// 					// onSeen?.(message._id);
// 					console.log("SEEN:", message._id, message.content);
// 					observer.unobserve(node);
// 				}
// 			},
// 			{
// 				root: observerRoot,
// 				threshold: [0.6],
// 			},
// 		);

// 		observer.observe(node);

// 		return () => {
// 			observer.disconnect();
// 		};
// 	}, [message._id, observerRoot, shouldTrackSeen, message.content]);
// 	// }, [message._id, onSeen, observerRoot, shouldTrackSeen]);

// 	const setRefs = (node) => {
// 		localRef.current = node;

// 		if (typeof forwardedRef === "function") {
// 			forwardedRef(node);
// 		} else if (forwardedRef) {
// 			forwardedRef.current = node;
// 		}
// 	};

// 	return (
// 		<div ref={setRefs}>
// 			<div
// 				className={cn(
// 					"flex w-full",
// 					isMe ? "justify-end" : "justify-start",
// 					isGroup ? "mt-1" : "mt-4",
// 				)}
// 			>
// 				<div
// 					className={cn(
// 						"flex max-w-[85%] items-end gap-2 sm:max-w-[75%] lg:max-w-[60%]",
// 						isMe ? "flex-row-reverse" : "flex-row",
// 					)}
// 				>
// 					<div className="w-8 shrink-0">
// 						{!isMe && !isGroup ? (
// 							<AvatarGenerator avatar={avatar} name={username} size="w-8 h-8" />
// 						) : null}
// 					</div>

// 					<div
// 						className={cn(
// 							"flex min-w-0 flex-col gap-1",
// 							isMe ? "items-end" : "items-start",
// 						)}
// 					>
// 						{isGroupConversation && !isGroup && !isMe && (
// 							<Muted className="px-1 text-xs font-medium">{username}</Muted>
// 						)}

// 						<ContextMenu>
// 							<ContextMenuTrigger asChild>
// 								<div
// 									className={cn(
// 										"inline-flex max-w-full min-w-0 flex-col gap-2 px-3.5 py-2 text-sm shadow-sm",
// 										isMe
// 											? "rounded-2xl rounded-br-sm bg-primary text-primary-foreground"
// 											: "rounded-2xl rounded-bl-sm border bg-background text-foreground",
// 									)}
// 								>
// 									{message?.replyTo && (
// 										<ReplyMessage replyMessage={message.replyTo} isMe={isMe} />
// 									)}

// 									{hasImageAttachment && (
// 										<MessageAttachmentImage attachment={attachment} />
// 									)}

// 									<div className="flex max-w-full items-end gap-1.5">
// 										<p className="max-w-full whitespace-pre-wrap break-words">
// 											{message?.content}
// 										</p>
// 										{isMe && <MessageItemCheckMarks message={message} />}
// 									</div>
// 								</div>
// 							</ContextMenuTrigger>

// 							<ContextMenuContent
// 								onCloseAutoFocus={(e) => {
// 									e.preventDefault();
// 									textareaRef?.current?.focus();
// 								}}
// 							>
// 								<ContextMenuItem onSelect={handleReply}>
// 									<Reply className="mr-2 h-4 w-4" />
// 									Reply
// 								</ContextMenuItem>
// 							</ContextMenuContent>
// 						</ContextMenu>
// 					</div>
// 				</div>
// 			</div>

// 			<Muted
// 				className={cn(
// 					"flex p-1 text-xs",
// 					isMe ? "justify-end pr-10" : "justify-start pl-10",
// 				)}
// 			>
// 				{formattedTime}
// 			</Muted>
// 		</div>
// 	);
// });

// export default MessageItem;
