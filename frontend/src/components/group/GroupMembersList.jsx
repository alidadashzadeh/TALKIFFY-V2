import { ScrollArea } from "../ui/scroll-area";
import GroupMembersListItem from "./GroupMembersListItem";
import { useConversationContext } from "@/contexts/ConversationContext";

function GroupMembersList() {
	const { currentConversation } = useConversationContext();
	return (
		<ScrollArea className="h-[60vh]">
			<div className="space-y-1 p-2">
				{currentConversation?.participants?.map((member) => (
					<GroupMembersListItem key={member._id} member={member} />
				))}
			</div>
		</ScrollArea>
	);
}

export default GroupMembersList;
