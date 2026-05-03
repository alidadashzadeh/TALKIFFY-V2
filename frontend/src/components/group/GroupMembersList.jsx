import { ScrollArea } from "../ui/scroll-area";
import GroupMembersListItem from "./GroupMembersListItem";

function GroupMembersList({ members = [] }) {
	return (
		<ScrollArea className=" space-y-3 h-[60vh]">
			<div className="space-y-1 p-2">
				{members.map((member) => (
					<GroupMembersListItem key={member._id} member={member} />
				))}
			</div>
		</ScrollArea>
	);
}

export default GroupMembersList;
