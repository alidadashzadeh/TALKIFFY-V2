import { Check, CheckCheck } from "lucide-react";
import { cn, getMessageDisplayData } from "@/lib/utils";
import { useConversationContext } from "@/contexts/ConversationContext";
import useCurrentUser from "@/hooks/user/useCurrentUser";

function MessageItemCheckMarks({ message }) {
	const { currentConversation } = useConversationContext();
	const { data: currentUser } = useCurrentUser();

	const { isMe: isMyMessage } = getMessageDisplayData(message, currentUser);
	const isGroupConversation = currentConversation?.type === "group";

	return (
		<span className="mb-0.5 shrink-0">
			{isMyMessage && !isGroupConversation && message?.isDelivered ? (
				<CheckCheck
					className={cn(
						"h-4 w-4 stroke-[2.6]",
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
