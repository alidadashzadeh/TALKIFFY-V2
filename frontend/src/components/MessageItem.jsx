/* eslint-disable react/prop-types */
import { Check, CheckCheck, UserCircle2 } from "lucide-react";

import { useAuthContext } from "../contexts/AuthContext";
import { useContactContext } from "../contexts/ContactContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function MessageItem({ message }) {
	const { currentUser } = useAuthContext();
	const { currentContactId } = useContactContext();

	const currentContact = currentUser.contacts.find(
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
			className={`flex items-start gap-1 py-1 ${isMe ? "" : "flex-row-reverse"}`}
		>
			{avatarFile ? (
				<Avatar className="h-8 w-8">
					<AvatarImage src={avatarUrl} alt={name} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
			) : (
				<UserCircle2 className="h-8 w-8" />
			)}

			<div
				className={`flex flex-col max-w-[75%] lg:max-w-[60%] ${
					isMe ? "items-start" : "items-end"
				}`}
			>
				<div
					className={`rounded-lg p-2 flex gap-2 items-center ${
						isMe
							? "bg-brand text-text__secondary rounded-tl-none"
							: "bg-select text-text__primary rounded-tr-none flex-row-reverse"
					}`}
				>
					{message?.content}

					{isMe &&
						(message?.isDelivered ? (
							<CheckCheck
								className={`h-4 w-4 ${message?.isSeen ? "text-green-500" : ""}`}
							/>
						) : (
							<Check className="h-4 w-4" />
						))}
				</div>

				<p className="text-[12px] text-text__accent">
					{new Date(message.createdAt).toLocaleTimeString("en-us", {
						hour: "2-digit",
						minute: "2-digit",
						hour12: true,
					})}
				</p>
			</div>
		</div>
	);
}

export default MessageItem;
