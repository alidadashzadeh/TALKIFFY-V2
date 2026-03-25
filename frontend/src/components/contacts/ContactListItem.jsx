/* eslint-disable react/prop-types */

import { useSocketContext } from "@/contexts/SocketContext";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import AvatarGenerator from "../AvatarGenerator";
import OnlineStatusDot from "../ui/OnlineStatusDot";

function ContactListItem({ contact, ActionComponent }) {
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(contact._id);

	return (
		<>
			<div
				className={cn(
					"relative flex w-full items-center gap-3 rounded-lg  px-3 py-3 text-left transition-all",
					"",
				)}
			>
				<div className="relative shrink-0">
					<AvatarGenerator avatar={contact.avatar} name={contact.username} />
					<OnlineStatusDot isOnline={isOnline} />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between gap-2">
						<p className="truncate font-medium">{contact.username}</p>
					</div>

					<p className="truncate text-sm text-muted-foreground">
						{contact.email}
					</p>
				</div>
				{ActionComponent ? <ActionComponent contact={contact} /> : null}
			</div>
			<Separator />
		</>
	);
}

export default ContactListItem;
