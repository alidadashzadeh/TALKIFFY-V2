import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Mic, Paperclip, Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import useSendMessage from "@/hooks/messages/useSendMessage";

function ChatMessageBar() {
	const { register, handleSubmit, reset, setValue, watch } = useForm({
		defaultValues: { message: "" },
	});

	const { sendMessage, loading } = useSendMessage();

	const textareaRef = useRef(null);

	const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
	const [showVoicePreview, setShowVoicePreview] = useState(false);

	const message = watch("message");
	const hasText = !!message?.trim();

	const messageField = register("message");

	const resizeTextarea = () => {
		const el = textareaRef.current;
		if (!el) return;

		el.style.height = "auto";
		el.style.height = `${el.scrollHeight}px`;
	};

	useEffect(() => {
		textareaRef.current?.focus();
		resizeTextarea();
	}, []);

	useEffect(() => {
		resizeTextarea();
	}, [message]);

	const onSubmit = async (data) => {
		const trimmedMessage = data.message?.trim();
		if (!trimmedMessage || loading) return;
		await sendMessage({ message: trimmedMessage });
		reset({ message: "" });
		requestAnimationFrame(() => {
			if (textareaRef.current) {
				textareaRef.current.style.height = "auto";
				textareaRef.current.focus();
			}
		});
	};

	const onEmojiClick = (emojiData) => {
		setValue("message", `${message || ""}${emojiData.emoji}`, {
			shouldDirty: true,
			shouldTouch: true,
		});

		requestAnimationFrame(() => {
			resizeTextarea();
			textareaRef.current?.focus();
		});
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(onSubmit)();
		}
	};

	return (
		<form
			className="mx-auto flex w-full max-w-4xl items-start gap-2 p-2"
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

			<div className="flex-1">
				<textarea
					{...messageField}
					ref={(el) => {
						messageField.ref(el);
						textareaRef.current = el;
					}}
					rows={1}
					placeholder="Type a message..."
					className="min-h-11 max-h-40 w-full resize-none overflow-y-auto rounded-3xl border bg-background px-4 py-3 text-sm leading-5 outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
					onKeyDown={handleKeyDown}
					onInput={resizeTextarea}
				/>
			</div>

			{hasText ? (
				<Button
					type="submit"
					size="icon"
					className="h-11 w-11 shrink-0 rounded-full"
					disabled={loading}
				>
					<Send className="h-5 w-5" />
				</Button>
			) : (
				<Button
					type="button"
					size="icon"
					variant="ghost"
					className="h-11 w-11 shrink-0 rounded-full"
					onClick={() => setShowVoicePreview(true)}
				>
					<Mic className="h-5 w-5 text-muted-foreground" />
				</Button>
			)}
		</form>
	);
}

export default ChatMessageBar;
