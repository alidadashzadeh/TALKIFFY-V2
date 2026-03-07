import { useConversationContext } from "@/contexts/ConversationContext";
import GroupChatHeaderActions from "./GroupChatHeaderActions";
import PrivateChatHeaderActions from "./PrivateChatHeaderActions";

function ChatHeaderActions() {
	const { currentConversation } = useConversationContext();

	if (currentConversation.type === "group") {
		return <GroupChatHeaderActions />;
	}

	return <PrivateChatHeaderActions />;
}

export default ChatHeaderActions;
