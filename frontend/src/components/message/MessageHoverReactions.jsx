import { useState } from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import EmojiPicker from "emoji-picker-react";
import { Plus } from "lucide-react";

const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

function MessageHoverReactions({ isMyMessage, message, children, onReact }) {
	const [showPicker, setShowPicker] = useState(false);

	return (
		<HoverCard openDelay={100} closeDelay={50}>
			<HoverCardTrigger asChild>
				<div className="inline-block">{children}</div>
			</HoverCardTrigger>

			<HoverCardContent
				side={isMyMessage ? "left" : "right"}
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
						onEmojiClick={(emojiData) => {
							onReact?.(emojiData.emoji, message);
							setShowPicker(false);
						}}
					/>
				) : (
					<div className="flex items-center gap-1">
						{quickReactions.map((emoji) => (
							<button
								key={emoji}
								type="button"
								className="w-8 h-8 flex items-center justify-center rounded-full p-1 text-lg transition hover:bg-muted"
								onClick={() => onReact?.(emoji, message)}
							>
								{emoji}
							</button>
						))}

						<button
							type="button"
							className=" w-8 h-8 flex items-center justify-center  rounded-full p-1 text-lg transition hover:bg-muted"
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
