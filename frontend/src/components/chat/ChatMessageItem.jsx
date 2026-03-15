/* eslint-disable react/prop-types */
import { Check, CheckCheck } from "lucide-react";

import { cn, getMessageDisplayData } from "@/lib/utils";
import AvatarGenerator from "../AvatarGenerator";
import { useConversationContext } from "@/contexts/ConversationContext";
import useCurrentUser from "@/hooks/user/useCurrentUser ";

function MessageItem({ message, isGroup }) {
	const { data: currentUser } = useCurrentUser();
	const { currentConversation } = useConversationContext();
	const isGroupConversation = currentConversation?.type === "group";

	const { isMe, username, avatar } = getMessageDisplayData(
		message,
		currentUser,
	);

	const attachment = message?.attachments?.[0];
	const hasImageAttachment = attachment?.type === "image" && attachment?.url;

	return (
		<div
			className={cn(
				"flex w-full",
				isMe ? "justify-end" : "justify-start",
				isGroup ? "mt-1" : "mt-4",
			)}
		>
			<div
				className={cn(
					"flex max-w-[85%] items-start gap-2 sm:max-w-[75%] lg:max-w-[65%]",
					isMe ? "flex-row-reverse" : "flex-row gap-4",
				)}
			>
				<div className="h-8 w-8 shrink-0">
					{!isGroup ? (
						<AvatarGenerator avatar={avatar} name={username} />
					) : null}
				</div>

				<div
					className={cn(
						"flex max-w-[520px] flex-col gap-1",
						isMe ? "items-end" : "items-start",
					)}
				>
					{isGroupConversation && !isGroup && !isMe && (
						<p className="px-1 text-xs font-medium text-muted-foreground">
							{username}
						</p>
					)}

					<div
						className={cn(
							"inline-flex max-w-full flex-col gap-2 px-3.5 py-2 text-sm shadow-sm",
							isMe
								? "bg-primary text-primary-foreground"
								: "border bg-background text-foreground",
							isMe
								? isGroup
									? "rounded-l-2xl rounded-br-sm rounded-tr-2xl"
									: "rounded-2xl rounded-br-md"
								: isGroup
									? "rounded-r-2xl rounded-bl-sm rounded-tl-2xl"
									: "rounded-2xl rounded-bl-md",
						)}
					>
						{hasImageAttachment && (
							<img
								src={attachment.url}
								alt={attachment.fileName || "attachment"}
								className="max-h-40 w-auto max-w-[220px] rounded-xl object-cover"
							/>
						)}

						{message?.content && (
							<div className="flex items-end gap-2">
								<p className="max-w-full whitespace-pre-wrap [overflow-wrap:anywhere]">
									{message.content}
								</p>

								{isMe && (
									<span className="mb-0.5 shrink-0">
										{message?.isDelivered ? (
											<CheckCheck
												className={cn(
													"h-3.5 w-3.5 stroke-[2.6]",
													message?.isSeen
														? "text-blue-600"
														: "text-primary-foreground/70",
												)}
											/>
										) : (
											<Check className="h-4 w-4 text-primary-foreground/70" />
										)}
									</span>
								)}
							</div>
						)}

						{!message?.content && isMe && (
							<div className="flex justify-end">
								<span className="mb-0.5 shrink-0">
									{message?.isDelivered ? (
										<CheckCheck
											className={cn(
												"h-3.5 w-3.5 stroke-[2.6]",
												message?.isSeen
													? "text-blue-600"
													: "text-primary-foreground/70",
											)}
										/>
									) : (
										<Check className="h-4 w-4 text-primary-foreground/70" />
									)}
								</span>
							</div>
						)}
					</div>

					<p className="px-1 text-[11px] text-muted-foreground">
						{new Date(message?.createdAt).toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
							hour12: true,
						})}
					</p>
				</div>
			</div>
		</div>
	);
}

export default MessageItem;
