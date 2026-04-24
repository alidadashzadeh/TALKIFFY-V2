import { groupMessageReactions } from "@/lib/utils/messages.js";
import AvatarGenerator from "../AvatarGenerator";
import { cn } from "@/lib/utils";

function MessageReactions({ message, isMyMessage }) {
	const groupedReactions = groupMessageReactions(message?.reactions);

	if (!groupedReactions.length) return null;

	return (
		<div
			className={cn(
				"-mt-1.5 flex flex-wrap gap-1 px-2",
				isMyMessage ? "justify-end" : "justify-start",
			)}
		>
			{groupedReactions.map((reactionGroup) => {
				const extraCount = Math.max(reactionGroup.users.length - 3, 0);

				return (
					<div
						key={reactionGroup.emoji}
						className="flex items-center gap-1 rounded-full border bg-background px-2 py-1 shadow-sm"
					>
						<span className="text-sm leading-none">{reactionGroup.emoji}</span>

						<div className="flex -space-x-1">
							{reactionGroup.users.slice(0, 3).map((user) => (
								<div
									key={user._id}
									className="rounded-full ring-1 ring-background"
									title={user.username}
								>
									<AvatarGenerator
										avatar={user.avatar}
										name={user.username}
										size="w-4 h-4"
									/>
								</div>
							))}
						</div>

						{extraCount > 0 ? (
							<span className="text-[10px] text-muted-foreground">
								+{extraCount}
							</span>
						) : null}
					</div>
				);
			})}
		</div>
	);
}

export default MessageReactions;
