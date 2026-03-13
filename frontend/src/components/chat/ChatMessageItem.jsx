/* eslint-disable react/prop-types */
import { Check, CheckCheck } from "lucide-react";

import { useAuthContext } from "@/contexts/AuthContext";
import { cn, getMessageDisplayData } from "@/lib/utils";
import AvatarGenerator from "../AvatarGenerator";
import { useConversationContext } from "@/contexts/ConversationContext";

function MessageItem({ message, isGroup }) {
	const { currentUser } = useAuthContext();
	const { currentConversation } = useConversationContext();
	const isGroupConversation = currentConversation?.type === "group";

	const { isMe, username, avatar } = getMessageDisplayData(
		message,
		currentUser,
	);

	return (
		<div
			className={cn(
				"flex w-full ",
				isMe ? "justify-end" : "justify-start",
				isGroup ? "mt-1" : "mt-4",
			)}
		>
			<div
				className={cn(
					"flex max-w-[85%] items-start gap-2 sm:max-w-[75%] lg:max-w-[65%] ",
					isMe ? "flex-row-reverse" : "flex-row gap-4",
				)}
			>
				<div className="w-8 h-8 shrink-0">
					{!isGroup ? (
						<AvatarGenerator avatar={avatar} name={username} />
					) : null}
				</div>

				<div
					className={cn(
						"flex flex-col gap-1 max-w-[520px]",
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
							"inline-flex  items-end gap-2 px-3.5 py-2 text-sm shadow-sm break-words",
							isMe
								? "bg-primary text-primary-foreground"
								: "border bg-background text-foreground",

							isMe
								? isGroup
									? "rounded-l-2xl rounded-tr-2xl rounded-br-sm"
									: "rounded-2xl rounded-br-md"
								: isGroup
									? "rounded-r-2xl rounded-tl-2xl rounded-bl-sm"
									: "rounded-2xl rounded-bl-md",
						)}
					>
						<p className="whitespace-pre-wrap [overflow-wrap:anywhere] max-w-full">
							{message?.content}
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
