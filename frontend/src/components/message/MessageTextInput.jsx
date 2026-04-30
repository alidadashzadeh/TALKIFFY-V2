import { useMessagesContext } from "@/contexts/MessagesContext";
import { Textarea } from "../ui/textarea";
import { useEffect } from "react";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";

function MessageTextInput({ handleSubmit }) {
	const { text, setText, textareaRef } = useMessagesContext();
	const { messageSearchOpen } = useSheetModalContext();

	const resizeTextarea = () => {
		const el = textareaRef.current;
		if (!el) return;

		el.style.height = "auto";
		el.style.height = `${el.scrollHeight}px`;
	};

	useEffect(() => {
		if (messageSearchOpen) return;

		requestAnimationFrame(() => {
			textareaRef.current?.focus();
		});
	}, [messageSearchOpen, textareaRef]);

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className="flex-1">
			<Textarea
				ref={textareaRef}
				rows={1}
				value={text}
				placeholder="Type a message..."
				className="min-h-11 max-h-40 w-full resize-none overflow-y-auto rounded-3xl border bg-background px-4 py-3 text-sm leading-5 outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
				onChange={(e) => setText(e.target.value)}
				onKeyDown={handleKeyDown}
				onInput={resizeTextarea}
			/>
		</div>
	);
}

export default MessageTextInput;
