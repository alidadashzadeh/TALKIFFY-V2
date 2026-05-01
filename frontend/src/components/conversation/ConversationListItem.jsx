import {
	cn,
	formatMessageTime,
	getConversationDisplayData,
	truncateText,
} from "@/lib/utils";

import { useConversationContext } from "@/contexts/ConversationContext";
import AvatarGenerator from "../AvatarGenerator";
import { Muted, P } from "../ui/typography";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import { useSocketContext } from "@/contexts/SocketContext";
import OnlineStatusDot from "../ui/OnlineStatusDot";

function ConversationListItem({ conversation, isActive = false }) {
	const { currentUser } = useCurrentUser();

	const { selectConversation } = useConversationContext();
	const { onlineUsers } = useSocketContext();

	const handleSelectConversation = () => {
		selectConversation(conversation);
	};

	const displayData = getConversationDisplayData(
		conversation,
		currentUser?._id,
	);

	const isOnline =
		conversation?.type !== "group" && onlineUsers.includes(displayData?.id);

	return (
		<button
			type="button"
			onClick={handleSelectConversation}
			className={cn(
				"flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-accent relative",
				isActive && "bg-accent",
			)}
		>
			<div className="relative shrink-0">
				<AvatarGenerator
					avatar={displayData?.avatar}
					name={displayData?.name}
				/>
				{conversation?.type !== "group" && (
					<OnlineStatusDot isOnline={isOnline} />
				)}
			</div>
			<div className="flex-col w-full">
				<div className="min-w-0 flex-1 flex justify-between items-center ">
					<P className="truncate font-medium">
						{truncateText(displayData?.name, 15)}
					</P>

					<Muted className="shrink-0 text-xs">
						{formatMessageTime(conversation?.lastMessageAt)}
					</Muted>
				</div>
				<div className=" flex gap-2 items-baseline">
					{conversation?.type === "group" && (
						<P className="text-blue-500 text-sm">
							@
							{truncateText(
								conversation?.lastMessageId?.senderId?.username,
								10,
							)}{" "}
							:
						</P>
					)}
					<Muted className="truncate text-sm text-muted-foreground">
						{truncateText(conversation?.lastMessageId?.content, 10)}
					</Muted>
				</div>
			</div>
			<div>
				{conversation?.unreadCount > 0 && (
					<div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs">
						{conversation.unreadCount}
					</div>
				)}
			</div>
		</button>
	);
}

export default ConversationListItem;
