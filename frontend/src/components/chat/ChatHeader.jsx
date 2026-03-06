import { useAuthContext } from "@/contexts/AuthContext";
import { useContactContext } from "@/contexts/ContactContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function ChatHeader() {
	const { currentContactId } = useContactContext();
	const { currentUser } = useAuthContext();

	const currentContact = currentUser?.contacts?.find(
		(contact) => contact._id === currentContactId,
	);

	if (!currentContact) return null;

	const avatarUrl = currentContact.avatar
		? import.meta.env.MODE === "development"
			? `http://localhost:5001/avatars/${currentContact.avatar}`
			: `https://talkiffy.onrender.com/avatars/${currentContact.avatar}`
		: "";

	const initials =
		(currentContact.username?.[0] || "?").toUpperCase() +
		(currentContact.username?.[1] || "").toUpperCase();

	return (
		<header className="w-full border-b bg-background">
			<div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
				<Avatar className="h-9 w-9">
					<AvatarImage src={avatarUrl} alt={currentContact.username} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>

				<div className="flex flex-col leading-tight">
					<span className="font-semibold text-foreground">
						{currentContact.username}
					</span>

					<span className="text-xs text-muted-foreground">Conversation</span>
				</div>
			</div>
		</header>
	);
}

export default ChatHeader;
