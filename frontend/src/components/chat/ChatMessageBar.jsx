import useSendMessage from "@/hooks/messages/useSendMessage";
import { useMessagesContext } from "@/contexts/MessagesContext";
import MessageTextInput from "../message/MessageTextInput";
import MessageFileInput from "../message/MessageFileInput";
import FilePreview from "./FilePreview";
import EmojiPopover from "./EmojiPopover";
import SendMessageBtn from "../buttons/SendMessageBtn";
import ReplyPreview from "./ReplyPreview";

function ChatMessageBar() {
	const { text, file, replyTo } = useMessagesContext();
	const { sendMessage } = useSendMessage();

	const onSubmit = () => {
		const trimmedMessage = text?.trim();
		if (!trimmedMessage && !file) return;
		sendMessage({ text: trimmedMessage, file, replyTo });
	};

	return (
		<div className="mx-auto w-full max-w-4xl p-2">
			{file && <FilePreview />}
			{replyTo && <ReplyPreview />}
			<form
				className="mx-auto flex w-full max-w-4xl items-start gap-2 p-2"
				onSubmit={(e) => {
					e.preventDefault();
					onSubmit();
				}}
			>
				<EmojiPopover />
				<MessageFileInput />
				<MessageTextInput handleSubmit={onSubmit} />
				<SendMessageBtn />
			</form>
		</div>
	);
}

export default ChatMessageBar;
