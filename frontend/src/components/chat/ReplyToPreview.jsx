import { Reply, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMessagesContext } from "@/contexts/MessagesContext";

function ReplyToPreview() {
	const { replyTo, setReplyTo } = useMessagesContext();

	if (!replyTo) return null;

	const attachment = replyTo?.attachments?.[0];
	const hasImage = replyTo?.type === "image" || attachment?.type === "image";

	return (
		<div className="mb-2 flex items-start gap-3 rounded-2xl border bg-background/95 px-3 py-2 shadow-sm">
			<div className="pt-0.5 text-muted-foreground">
				<Reply className="h-6 w-6" />
			</div>

			<div className="flex min-w-0 flex-1 items-start gap-3">
				<div className="min-w-0 flex-1">
					<p className="text-xs font-medium text-primary">
						Replying to {replyTo?.senderId?.username}
					</p>

					<div className="mt-1 rounded-xl border-l-4 border-primary/70 bg-muted/60 px-3 py-2">
						<div className="flex min-w-0 items-start gap-3">
							{hasImage && (
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
								{replyTo?.content ? (
									<p className="truncate text-sm text-foreground">
										{replyTo.content}
									</p>
								) : (
									<p className="text-sm text-muted-foreground">
										{hasImage ? "Photo" : "Message"}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>

				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => setReplyTo(null)}
					className="h-8 w-8 shrink-0 rounded-full"
				>
					<X className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}

export default ReplyToPreview;
