import { cn } from "@/lib/utils";

function OnlineStatusDot({ isOnline }) {
	return (
		<span
			className={cn(
				"absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background",
				isOnline ? "bg-green-500" : "bg-muted",
			)}
		/>
	);
}

export default OnlineStatusDot;
