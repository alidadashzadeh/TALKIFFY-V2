import { useRef, useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useMessagesContext } from "@/contexts/MessagesContext";

function EmojiPopover() {
	const { setText, textareaRef } = useMessagesContext();
	const [open, setOpen] = useState(false);
	const ignoreCloseRef = useRef(false);

	const onEmojiClick = (emojiData) => {
		ignoreCloseRef.current = true;

		setText((prev) => `${prev || ""}${emojiData.emoji}`);

		requestAnimationFrame(() => {
			textareaRef.current?.focus();

			setTimeout(() => {
				ignoreCloseRef.current = false;
			}, 0);
		});
	};

	const handleOpenChange = (nextOpen) => {
		if (!nextOpen && ignoreCloseRef.current) return;
		setOpen(nextOpen);
	};

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<Button type="button" size="icon" variant="ghost">
					<Smile className="h-5 w-5 text-muted-foreground" />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				className="w-fit border-none p-0"
				onOpenAutoFocus={(e) => e.preventDefault()}
				onCloseAutoFocus={(e) => e.preventDefault()}
			>
				<EmojiPicker onEmojiClick={onEmojiClick} />
			</PopoverContent>
		</Popover>
	);
}

export default EmojiPopover;
