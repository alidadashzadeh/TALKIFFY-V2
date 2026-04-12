import { cn, getConversationDisplayData } from "@/lib/utils";
import AvatarGenerator from "../AvatarGenerator";

import { useConversationContext } from "@/contexts/ConversationContext";

import GroupChatHeaderActions from "./GroupChatHeaderActions";
import PrivateChatHeaderActions from "./PrivateChatHeaderActions";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import { useSocketContext } from "@/contexts/SocketContext";
import OnlineStatusDot from "../ui/OnlineStatusDot";

function ChatHeader() {
	const { currentConversation } = useConversationContext();
	const { currentUser } = useCurrentUser();
	const { onlineUsers } = useSocketContext();

	const displayData = getConversationDisplayData(
		currentConversation,
		currentUser?._id,
	);
	const isOnline =
		currentConversation?.type !== "group" &&
		onlineUsers.includes(displayData?.id);

	if (!currentConversation) return null;

	return (
		<header className="w-full border-b bg-background px-16 py-3">
			<div className="flex items-center justify-between">
				{/* LEFT SIDE */}
				<div className="flex min-w-0 items-center gap-3 ">
					<div className="relative">
						<AvatarGenerator
							avatar={displayData?.avatar}
							name={displayData?.name}
						/>
						{currentConversation?.type !== "group" && (
							<OnlineStatusDot isOnline={isOnline} />
						)}
					</div>

					<div className="min-w-0">
						<h2 className="truncate font-semibold">{displayData?.name}</h2>
					</div>
				</div>

				{/* RIGHT SIDE ACTIONS */}
				<div className="flex items-center">
					{currentConversation.type === "group" ? (
						<GroupChatHeaderActions />
					) : (
						<PrivateChatHeaderActions />
					)}
				</div>
			</div>
		</header>
	);
}

export default ChatHeader;
