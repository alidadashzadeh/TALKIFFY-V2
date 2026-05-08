import { Check, CheckCheck } from "lucide-react";
import { cn, getMessageDisplayData } from "@/lib/utils";
import { useConversationContext } from "@/contexts/ConversationContext";
import useCurrentUser from "@/hooks/user/useCurrentUser";

function MessageItemCheckMarks({ message, isSeenByOtherUser }) {
	const { currentConversation } = useConversationContext();
	const { currentUser } = useCurrentUser();

	const { isMe: isMyMessage } = getMessageDisplayData(message, currentUser);
	const isGroupConversation = currentConversation?.type === "group";

	return (
		<span className="mb-0.5 shrink-0">
			{isMyMessage && !isGroupConversation && message?.isDelivered ? (
				<CheckCheck
					className={cn(
						"h-4 w-4 stroke-[2.4]",
						isSeenByOtherUser
							? "text-sky-400 drop-shadow-[0_0_3px_rgba(56,189,248,0.45)]"
							: "text-primary-foreground/70",
					)}
				/>
			) : (
				<Check className="h-4 w-4 text-primary-foreground/70" />
			)}
		</span>
	);
}

export default MessageItemCheckMarks;
