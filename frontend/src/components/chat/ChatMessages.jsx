import ChatMessagesLoading from "./ChatMessagesLoading";
import ChatNoMessages from "./ChatNoMessages";
import useGetMessages from "@/hooks/messages/useGetMessages";
import ChatMessagesContainer from "./ChatMessagesContainer";

function ChatMessages() {
	const { messages = [], loading } = useGetMessages();

	if (loading) {
		return <ChatMessagesLoading />;
	}

	if (!messages.length) {
		return <ChatNoMessages />;
	}

	return <ChatMessagesContainer messages={messages} />;
}

export default ChatMessages;
