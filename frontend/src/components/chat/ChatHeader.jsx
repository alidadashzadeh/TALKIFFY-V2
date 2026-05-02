import { getConversationDisplayData } from "@/lib/utils";
import AvatarGenerator from "../AvatarGenerator";
import { useConversationContext } from "@/contexts/ConversationContext";
import GroupChatHeaderActions from "./GroupChatHeaderActions";
import PrivateChatHeaderActions from "./PrivateChatHeaderActions";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import { useSocketContext } from "@/contexts/SocketContext";
import OnlineStatusDot from "../ui/OnlineStatusDot";
import { H4 } from "../ui/typography";

function ChatHeader() {
	const { currentConversation } = useConversationContext();
	const { currentUser } = useCurrentUser();
	const { onlineUsers } = useSocketContext();

	// conversation party information
	const { name, avatar, id } = getConversationDisplayData(
		currentConversation,
		currentUser?._id,
	);
	const isOnline =
		currentConversation?.type !== "group" && onlineUsers?.includes(id);
	const isGroup = currentConversation?.type === "group";

	return (
		<header className="w-full border-b bg-background px-16 py-3">
			<div className="flex items-center justify-between">
				{/* LEFT SIDE */}
				<div className="flex min-w-0 items-center gap-3 ">
					<div className="relative">
						<AvatarGenerator avatar={avatar} name={name} />
						{currentConversation?.type !== "group" && (
							<OnlineStatusDot isOnline={isOnline} />
						)}
					</div>
					<H4 className="truncate font-semibold">{name}</H4>
				</div>

				{/* RIGHT SIDE ACTIONS */}
				<div className="flex items-center">
					{isGroup ? <GroupChatHeaderActions /> : <PrivateChatHeaderActions />}
				</div>
			</div>
		</header>
	);
}

export default ChatHeader;
