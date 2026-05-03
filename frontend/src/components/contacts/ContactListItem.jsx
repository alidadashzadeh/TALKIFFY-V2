import { useSocketContext } from "@/contexts/SocketContext";
import { cn, truncateText } from "@/lib/utils";
import { Separator } from "../ui/separator";
import AvatarGenerator from "../AvatarGenerator";
import OnlineStatusDot from "../ui/OnlineStatusDot";

function ContactListItem({ contact, ActionComponent }) {
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(contact?._id);

	return (
		<>
			<div
				className={cn(
					"relative flex w-full items-center gap-3 rounded-lg  px-3 py-3 text-left transition-all",
					"",
				)}
			>
				<div className="relative shrink-0">
					<AvatarGenerator avatar={contact?.avatar} name={contact?.username} />
					<OnlineStatusDot isOnline={isOnline} />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between gap-2">
						<p className="font-medium">{truncateText(contact?.username, 20)}</p>
					</div>

					<p className="text-sm text-muted-foreground">
						{truncateText(contact?.email, 35)}
					</p>
				</div>
				{contact && ActionComponent ? (
					<ActionComponent contact={contact} />
				) : null}
			</div>
			<Separator />
		</>
	);
}

export default ContactListItem;
