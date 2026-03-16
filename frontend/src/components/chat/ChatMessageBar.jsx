import useSendMessage from "@/hooks/messages/useSendMessage";
import { useMessagesContext } from "@/contexts/MessagesContext";
import MessageTextInput from "./MessageTextInput";
import MessageFileInput from "./MessageFileInput";
import FilePreview from "./FilePreview";
import EmojiPopover from "./EmojiPopover";
import SendMessageBtn from "../buttons/SendMessageBtn";

function ChatMessageBar() {
	const { text, file, clearMessageState } = useMessagesContext();
	const { sendMessage, loading } = useSendMessage();

	const onSubmit = async () => {
		const trimmedMessage = text?.trim();
		if (!trimmedMessage || loading) return;

		await sendMessage({ text, file });
		clearMessageState();
	};

	return (
		<div className="mx-auto w-full max-w-4xl p-2">
			{file && !loading && <FilePreview />}
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
				<SendMessageBtn loading={loading} />
			</form>
		</div>
	);
}

export default ChatMessageBar;
