import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Paperclip, Send, Smile, Mic } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import EmojiPicker from "emoji-picker-react";
import useSendMessage from "@/hooks/messages/useSendMessage";

function ChatMessageBar() {
	const { register, handleSubmit, reset, setValue, watch } = useForm({
		defaultValues: { message: "" },
	});

	const { sendMessage, loading } = useSendMessage();
	const inputRef = useRef(null);

	const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
	const [showVoicePreview, setShowVoicePreview] = useState(false);

	const message = watch("message");
	const hasText = !!message?.trim();

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const onSubmit = async (data) => {
		const trimmedMessage = data.message?.trim();
		if (!trimmedMessage || loading) return;

		try {
			await sendMessage({ message: trimmedMessage });
			reset();
			inputRef.current?.focus();
		} catch {
			// error already handled in mutation hook
		}
	};

	const onEmojiClick = (emojiData) => {
		setValue("message", `${message || ""}${emojiData.emoji}`, {
			shouldDirty: true,
		});
		inputRef.current?.focus();
	};
	return (
		<form
			className="flex w-full items-center gap-2 p-2"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Popover>
				<PopoverTrigger asChild>
					<Button type="button" size="icon" variant="ghost">
						<Smile className="h-5 w-5 text-muted-foreground" />
					</Button>
				</PopoverTrigger>

				<PopoverContent className="w-fit border-none p-0">
					<EmojiPicker onEmojiClick={onEmojiClick} />
				</PopoverContent>
			</Popover>

			<Button
				type="button"
				size="icon"
				variant="ghost"
				onClick={() => setShowAttachmentPreview(true)}
			>
				<Paperclip className="h-5 w-5 text-muted-foreground" />
			</Button>

			<Input
				ref={inputRef}
				placeholder="Type a message..."
				className="h-11 flex-1 rounded-full border px-4"
				{...register("message")}
			/>

			{hasText ? (
				<Button type="submit" size="icon" className="h-11 w-11 rounded-full">
					<Send className="h-5 w-5" />
				</Button>
			) : (
				<Button
					type="button"
					size="icon"
					variant="ghost"
					className="h-11 w-11 rounded-full"
					onClick={() => setShowVoicePreview(true)}
				>
					<Mic className="h-5 w-5 text-muted-foreground" />
				</Button>
			)}
		</form>
	);
}

export default ChatMessageBar;
