/* eslint-disable react/prop-types */
import { cn, getMessageDisplayData } from "@/lib/utils";
import useCurrentUser from "@/hooks/user/useCurrentUser ";

function ReplyMessage({ replyMessage, isMe }) {
	const { data: currentUser } = useCurrentUser();

	if (!replyMessage) return null;

	const { username } = getMessageDisplayData(replyMessage, currentUser);

	const attachment = replyMessage?.attachments?.[0];
	const hasImageAttachment = attachment?.type === "image";

	return (
		<div
			className={cn(
				"rounded-xl border-l-2 px-3 py-2 text-xs",
				isMe
					? "border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground"
					: "border-primary bg-muted/70 text-muted-foreground",
			)}
		>
			<p
				className={cn(
					"mb-1 font-medium",
					isMe ? "text-primary-foreground" : "text-foreground",
				)}
			>
				{username}
			</p>

			<div className="flex min-w-0 items-start gap-3">
				{hasImageAttachment && (
					<div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-background">
						{attachment && attachment?.url && (
							<img
								src={attachment?.localUrl || attachment?.url}
								alt={attachment?.fileName || "reply attachment"}
								className="h-full w-full object-cover"
							/>
						)}
					</div>
				)}

				<div className="min-w-0 flex-1">
					{replyMessage?.content ? (
						<p className="truncate text-sm text-foreground">
							{replyMessage.content}
						</p>
					) : (
						<p className="text-sm text-muted-foreground">
							{hasImageAttachment ? "Photo" : "Message"}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default ReplyMessage;
