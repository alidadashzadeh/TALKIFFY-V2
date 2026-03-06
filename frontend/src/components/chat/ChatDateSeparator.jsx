import { formatSeparatorDate } from "@/lib/utils";

function ChatDateSeparator({ date }) {
	return (
		<div className="flex items-center justify-center py-4">
			<div className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
				{formatSeparatorDate(date)}
			</div>
		</div>
	);
}

export default ChatDateSeparator;
