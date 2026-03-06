/* eslint-disable react/prop-types */
import { Check, CheckCheck, UserCircle2 } from "lucide-react";

import { useAuthContext } from "@/contexts/AuthContext";
import { useContactContext } from "@/contexts/ContactContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function MessageItem({ message }) {
	const { currentUser } = useAuthContext();
	const { currentContactId } = useContactContext();

	const currentContact = currentUser?.contacts?.find(
		(contact) => contact._id === currentContactId,
	);

	const isMe = message.senderId === currentUser?._id;

	const name = isMe ? currentUser?.username : currentContact?.username;
	const avatarFile = isMe ? currentUser?.avatar : currentContact?.avatar;

	const avatarUrl = avatarFile
		? import.meta.env.MODE === "development"
			? `http://localhost:5001/avatars/${avatarFile}`
			: `https://talkiffy.onrender.com/avatars/${avatarFile}`
		: "";

	const initials =
		(name?.[0] || "?").toUpperCase() + (name?.[1] || "").toUpperCase();

	return (
		<div
			className={cn(
				"flex w-full py-1.5",
				isMe ? "justify-end" : "justify-start",
			)}
		>
			<div
				className={cn(
					"flex max-w-[85%] items-end gap-2 sm:max-w-[75%] lg:max-w-[65%]",
					isMe ? "flex-row-reverse" : "flex-row",
				)}
			>
				{avatarFile ? (
					<Avatar className="h-8 w-8 shrink-0">
						<AvatarImage src={avatarUrl} alt={name} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				) : (
					<UserCircle2 className="h-8 w-8 shrink-0 text-muted-foreground" />
				)}

				<div
					className={cn(
						"flex flex-col gap-1",
						isMe ? "items-end" : "items-start",
					)}
				>
					<div
						className={cn(
							"inline-flex items-end gap-2 rounded-2xl px-4 py-2.5 text-sm shadow-sm break-words",
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
											"h-4 w-4",
											message?.isSeen
												? "text-blue-300"
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
						{new Date(message.createdAt).toLocaleTimeString("en-US", {
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
