/* eslint-disable react/prop-types */
import { Check, CheckCheck } from "lucide-react";

import { useAuthContext } from "@/contexts/AuthContext";
import { useContactContext } from "@/contexts/ContactContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function MessageItem({ message }) {
	const { currentUser } = useAuthContext();
	const { currentContactId } = useContactContext();

	const currentContact = currentUser?.contacts?.find(
		(contact) => contact?._id === currentContactId,
	);

	const isMe = message?.senderId?._id === currentUser?._id;
	const username = isMe ? currentUser?.username : currentContact?.username;
	const avatarFile = isMe ? currentUser?.avatar : currentContact?.avatar;

	const avatarUrl = avatarFile
		? import.meta.env.MODE === "development"
			? `http://localhost:5001/avatars/${avatarFile}`
			: `https://talkiffy.onrender.com/avatars/${avatarFile}`
		: "";
	const initials =
		(username?.[0] || "?").toUpperCase() + (username?.[1] || "").toUpperCase();

	return (
		<div className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
			<div
				className={cn(
					"flex max-w-[85%] items-baseline gap-2 sm:max-w-[75%] lg:max-w-[65%]",
					isMe ? "flex-row-reverse" : "flex-row",
				)}
			>
				<Avatar className="h-10 w-10">
					<AvatarImage src={avatarUrl} alt={username} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>

				<div
					className={cn(
						"flex flex-col gap-1",
						isMe ? "items-end" : "items-start",
					)}
				>
					<div
						className={cn(
							"inline-flex items-end gap-2 rounded-2xl px-3.5 py-2 text-sm shadow-sm break-words",
							isMe
								? "rounded-br-md bg-primary text-primary-foreground"
								: "rounded-bl-md border bg-background text-foreground",
						)}
					>
						<p className="whitespace-pre-wrap break-words">
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
