import { useState } from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import EmojiPicker from "emoji-picker-react";
import { Plus } from "lucide-react";

const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

function MessageHoverReactions({
	isMyMessage,
	message,
	children,
	onReact,
	open,
	onOpenChange,
}) {
	const [showPicker, setShowPicker] = useState(false);

	const handleReact = (emoji) => {
		onReact?.(emoji, message);
		setShowPicker(false);
		onOpenChange?.(false);
	};

	return (
		<HoverCard
			open={open}
			onOpenChange={onOpenChange}
			openDelay={100}
			closeDelay={50}
		>
			<HoverCardTrigger asChild>
				<div className="inline-block">{children}</div>
			</HoverCardTrigger>

			<HoverCardContent
				side={
					window.innerWidth < 768 ? "bottom" : isMyMessage ? "left" : "right"
				}
				align="center"
				sideOffset={8}
				className="w-fit rounded-2xl border bg-background p-2 shadow-md"
			>
				{showPicker ? (
					<EmojiPicker
						width={320}
						height={360}
						lazyLoadEmojis
						previewConfig={{ showPreview: false }}
						onEmojiClick={(emojiData) => handleReact(emojiData.emoji)}
					/>
				) : (
					<div className="flex items-center gap-1">
						{quickReactions.map((emoji) => (
							<button
								key={emoji}
								type="button"
								className="flex h-8 w-8 items-center justify-center rounded-full p-1 text-lg transition hover:bg-muted"
								onClick={() => handleReact(emoji)}
							>
								{emoji}
							</button>
						))}

						<button
							type="button"
							className="flex h-8 w-8 items-center justify-center rounded-full p-1 text-lg transition hover:bg-muted"
							onClick={() => setShowPicker(true)}
						>
							<Plus />
						</button>
					</div>
				)}
			</HoverCardContent>
		</HoverCard>
	);
}

export default MessageHoverReactions;
