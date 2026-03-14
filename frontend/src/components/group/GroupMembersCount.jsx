import { Users } from "lucide-react";
import { Muted } from "../ui/typography";
import { useConversationContext } from "@/contexts/ConversationContext";

function GroupMembersCount() {
	const { currentConversation } = useConversationContext();

	if (currentConversation?.type !== "group") return;

	return (
		<Muted className="flex items-center gap-2">
			<Users size={16} />
			{currentConversation?.participants?.length} Members
		</Muted>
	);
}

export default GroupMembersCount;
