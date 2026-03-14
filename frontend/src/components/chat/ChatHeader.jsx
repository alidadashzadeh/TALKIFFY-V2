import { getConversationDisplayData } from "@/lib/utils";
import AvatarGenerator from "../AvatarGenerator";

import { useConversationContext } from "@/contexts/ConversationContext";

import GroupChatHeaderActions from "./GroupChatHeaderActions";
import PrivateChatHeaderActions from "./PrivateChatHeaderActions";
import useCurrentUser from "@/hooks/user/useCurrentUser ";

function ChatHeader() {
	const { currentConversation } = useConversationContext();
	const { data: currentUser } = useCurrentUser();

	const displayData = getConversationDisplayData(
		currentConversation,
		currentUser?._id,
	);

	if (!currentConversation) return null;

	return (
		<header className="w-full border-b bg-background px-16 py-3">
			<div className="flex items-center justify-between">
				{/* LEFT SIDE */}
				<div className="flex min-w-0 items-center gap-3">
					<AvatarGenerator
						avatar={displayData?.avatar}
						name={displayData?.name}
					/>

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
