/* eslint-disable react/prop-types */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocketContext } from "@/contexts/SocketContext";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";
import { Separator } from "../ui/separator";
import { useConversationContext } from "@/contexts/ConversationContext";
import { Spinner } from "../ui/spinner";
import useGetOrCreatePrivateConversation from "@/hooks/conversation/useGetOrCreatePrivateConversation";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";

function ContactListItem({ contact }) {
	const { setAccountSheetOpen, setContactModalOpen } = useSheetModalContext();

	const { onlineUsers } = useSocketContext();
	const { selectConversation } = useConversationContext();

	const { getOrCreatePrivateConversation, loading } =
		useGetOrCreatePrivateConversation();

	const handleMessageClick = async () => {
		try {
			const conversation = await getOrCreatePrivateConversation(contact._id);
			setAccountSheetOpen(false);
			setContactModalOpen(false);

			if (conversation?.data?.conversation?._id) {
				selectConversation(conversation);
			}
		} catch (error) {
			console.error("Failed to get or create conversation:", error);
		}
	};
	const isOnline = onlineUsers.includes(contact._id);

	const avatarSrc =
		import.meta.env.MODE === "development"
			? `http://localhost:5001/avatars/${contact.avatar}`
			: `https://talkiffy.onrender.com/avatars/${contact.avatar}`;

	return (
		<>
			<div
				className={cn(
					"relative flex w-full items-center gap-3 rounded-lg  px-3 py-3 text-left transition-all",
					"",
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
					</div>

					<p className="truncate text-sm text-muted-foreground">
						{contact.email}
					</p>
				</div>
				<Button
					type="button"
					size="icon"
					variant="ghost"
					onClick={handleMessageClick}
					// disabled={loading}
					aria-label={`Message ${contact.username}`}
				>
					{loading ? <Spinner /> : <MessageSquare className="h-5 w-5" />}
				</Button>
			</div>
			<Separator />
		</>
	);
}

export default ContactListItem;
