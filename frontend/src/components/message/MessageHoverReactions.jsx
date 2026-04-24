import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";

const reactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

function MessageHoverReactions({ isMyMessage, message, children, onReact }) {
	return (
		<HoverCard openDelay={100} closeDelay={50}>
			<HoverCardTrigger asChild>
				<div className="inline-block">{children}</div>
			</HoverCardTrigger>

			<HoverCardContent
				side={isMyMessage ? "left" : "right"}
				align="center"
				sideOffset={8}
				className="w-fit rounded-full border bg-background px-2 py-1 shadow-md"
			>
				<div className="flex items-center gap-1">
					{reactions.map((emoji) => (
						<button
							key={emoji}
							type="button"
							className="rounded-full p-1 text-lg transition hover:bg-muted"
							onClick={() => onReact?.(emoji, message)}
						>
							{emoji}
						</button>
					))}
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}

export default MessageHoverReactions;
