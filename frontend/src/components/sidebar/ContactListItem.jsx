/* eslint-disable react/prop-types */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContactContext } from "@/contexts/ContactContext";
import { useSocketContext } from "@/contexts/SocketContext";
import { useMessagesContext } from "@/contexts/MessagesContext";
import { cn } from "@/lib/utils";

function ContactListItem({ contact }) {
	const { currentContactId, setCurrentContactId } = useContactContext();
	const { onlineUsers } = useSocketContext();
	const { unseenMessages, setUnseenMessages } = useMessagesContext();

	const isActive = currentContactId === contact._id;
	const isOnline = onlineUsers.includes(contact._id);

	const unseenCount =
		unseenMessages?.filter((message) => message.senderId === contact._id)
			.length || 0;

	const hasUnseenMessage = unseenCount > 0;

	const handleClick = () => {
		setCurrentContactId(contact._id);
		setUnseenMessages((prev) =>
			prev?.filter((message) => message?.senderId !== contact._id),
		);
	};

	const avatarSrc =
		import.meta.env.MODE === "development"
			? `http://localhost:5001/avatars/${contact.avatar}`
			: `https://talkiffy.onrender.com/avatars/${contact.avatar}`;

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"relative flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all",
				"hover:bg-accent hover:text-accent-foreground",
				isActive
					? "border-primary/30 bg-accent shadow-sm"
					: "border-transparent",
			)}
		>
			<div className="relative shrink-0">
				<Avatar className="h-11 w-11">
					<AvatarImage src={avatarSrc} alt={contact.username} />
					<AvatarFallback>
						{contact.username?.slice(0, 2)?.toUpperCase()}
					</AvatarFallback>
				</Avatar>

				<span
					className={cn(
						"absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background",
						isOnline ? "bg-green-500" : "bg-muted",
					)}
				/>
			</div>

			<div className="min-w-0 flex-1">
				<div className="flex items-center justify-between gap-2">
					<p className="truncate font-medium">{contact.username}</p>

					{hasUnseenMessage && (
						<span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs font-semibold text-primary-foreground">
							{unseenCount}
						</span>
					)}
				</div>

				<p className="truncate text-sm text-muted-foreground">
					{contact.email}
				</p>
			</div>
		</button>
	);
}

export default ContactListItem;
