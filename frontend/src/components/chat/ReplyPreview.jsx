import { Reply, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMessagesContext } from "@/contexts/MessagesContext";
import ReplyCard from "../ui/ReplyCard";

function ReplyPreview() {
	const { replyTo, setReplyTo } = useMessagesContext();

	if (!replyTo) return null;

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

					<ReplyCard message={replyTo} className="mt-1" />
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

export default ReplyPreview;
