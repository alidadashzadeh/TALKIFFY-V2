import ChatMessagesLoading from "./ChatMessagesLoading";
import ChatNoMessages from "./ChatNoMessages";
import useGetMessages from "@/hooks/messages/useGetMessages";
import ChatMessagesContainer from "./ChatMessagesContainer";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import { useConversationContext } from "@/contexts/ConversationContext";

function ChatMessages() {
	const { messages = [], loading } = useGetMessages();
	const { currentUser } = useCurrentUser();
	const conversationCtx = useConversationContext();

	if (loading) {
		return <ChatMessagesLoading />;
	}

	if (!messages.length) {
		return <ChatNoMessages />;
	}

	return (
		<ChatMessagesContainer
			messages={messages}
			currentUser={currentUser}
			{...conversationCtx}
		/>
	);
}

export default ChatMessages;
