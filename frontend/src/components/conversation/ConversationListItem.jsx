import {
	cn,
	formatMessageTime,
	getConversationDisplayData,
	truncateText,
} from "@/lib/utils";

import useCurrentUser from "@/hooks/user/useCurrentUser";
import { useConversationContext } from "@/contexts/ConversationContext";
import { useSocketContext } from "@/contexts/SocketContext";

import AvatarGenerator from "../AvatarGenerator";
import OnlineStatusDot from "../ui/OnlineStatusDot";
import { Muted, P } from "../ui/typography";

function ConversationListItem({ conversation, isActive = false }) {
	const { currentUser } = useCurrentUser();
	const { selectConversation } = useConversationContext();
	const { onlineUsers } = useSocketContext();

	const displayData = getConversationDisplayData(
		conversation,
		currentUser?._id,
	);

	const isGroup = conversation?.type === "group";
	const lastMessage = conversation?.lastMessageId;
	const senderName = lastMessage?.senderId?.username;
	const unreadCount = conversation?.unreadCount || 0;

	const isOnline = !isGroup && onlineUsers.includes(displayData?.id);

	return (
		<button
			type="button"
			onClick={() => selectConversation(conversation)}
			className={cn(
				"relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-accent",
				isActive && "bg-accent",
			)}
		>
			<div className="relative shrink-0">
				<AvatarGenerator
					avatar={displayData?.avatar}
					name={displayData?.name}
				/>

				{!isGroup && <OnlineStatusDot isOnline={isOnline} />}
			</div>

			<div className="min-w-0 flex-1">
				<div className="flex items-center justify-between gap-2">
					<P className="truncate font-medium">{displayData?.name}</P>

					<Muted className="shrink-0 text-xs">
						{formatMessageTime(conversation?.lastMessageAt)}
					</Muted>
				</div>

				<div className="flex min-w-0 items-baseline gap-1">
					{isGroup && senderName && (
						<P className="shrink-0 text-sm text-blue-500">
							@{truncateText(senderName, 10)}:
						</P>
					)}

					<Muted className="truncate text-sm">
						{lastMessage?.content || "No messages yet"}
					</Muted>
				</div>
			</div>

			{unreadCount > 0 && (
				<div className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs text-white">
					{unreadCount}
				</div>
			)}
		</button>
	);
}

export default ConversationListItem;
