import { cn } from "@/lib/utils";

function ReplyCard({ username, message, isMe = false, className, onClick }) {
	if (!message) return null;

	const attachment = message?.attachments?.[0];
	const hasImage = message?.type === "image" || attachment?.type === "image";

	return (
		<div
			onClick={onClick}
			className={cn(
				"rounded-xl border-l-4 px-3 py-2 text-xs",
				onClick && "cursor-pointer",
				isMe
					? "border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground"
					: "border-primary/70 bg-muted/60 text-muted-foreground",
				className,
			)}
		>
			{username && (
				<p
					className={cn(
						"mb-1 font-medium",
						isMe ? "text-primary-foreground" : "text-foreground",
					)}
				>
					{username}
				</p>
			)}

			<div className="flex min-w-0 items-start gap-3">
				{hasImage && (
					<div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-background">
						{attachment?.url && (
							<img
								src={attachment.localUrl || attachment.url}
								alt={attachment.fileName || "reply attachment"}
								className="h-full w-full object-cover"
							/>
						)}
					</div>
				)}

				<div className="min-w-0 flex-1">
					{message?.content ? (
						<p
							className={cn(
								"truncate text-sm",
								isMe ? "text-primary-foreground" : "text-foreground",
							)}
						>
							{message.content}
						</p>
					) : (
						<p
							className={cn(
								"text-sm",
								isMe ? "text-primary-foreground/80" : "text-muted-foreground",
							)}
						>
							{hasImage ? "Photo" : "Message"}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default ReplyCard;
