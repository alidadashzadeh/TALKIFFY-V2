import { useAuthContext } from "../contexts/AuthContext";
import { useContactContext } from "../contexts/ContactContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function MessageHeader() {
	const { currentContactId } = useContactContext();
	const { currentUser } = useAuthContext();

	const currentContact = currentUser?.contacts?.find(
		(contact) => contact._id === currentContactId,
	);

	const avatarUrl = currentContact?.avatar
		? import.meta.env.MODE === "development"
			? `http://localhost:5001/avatars/${currentContact.avatar}`
			: `https://talkiffy.onrender.com/avatars/${currentContact.avatar}`
		: "";

	const initials =
		(currentContact?.username?.[0] || "?").toUpperCase() +
		(currentContact?.username?.[1] || "").toUpperCase();

	if (!currentContact) return null;

	return (
		<div className="flex gap-4 items-center justify-start w-full p-2 bg-brand">
			<Avatar className="h-9 w-9">
				<AvatarImage src={avatarUrl} alt={currentContact.username} />
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>

			<p className="font-bold text-text__secondary">
				{currentContact.username}
			</p>
		</div>
	);
}

export default MessageHeader;
