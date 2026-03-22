import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

function MessageItemCheckMarks({ message }) {
	return (
		<span className="mb-0.5 shrink-0">
			{message?.isDelivered ? (
				<CheckCheck
					className={cn(
						"h-3.5 w-3.5 stroke-[2.6]",
						message?.isSeen ? "text-blue-600" : "text-primary-foreground/70",
					)}
				/>
			) : (
				<Check className="h-4 w-4 text-primary-foreground/70" />
			)}
		</span>
	);
}

export default MessageItemCheckMarks;
