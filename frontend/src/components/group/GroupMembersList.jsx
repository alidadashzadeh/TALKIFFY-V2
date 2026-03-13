import { ScrollArea } from "../ui/scroll-area";
import GroupMembersListItem from "./GroupMembersListItem";

function GroupMembersList({ members = [] }) {
	return (
		<div className="space-y-3">
			<ScrollArea className="h-full">
				<div className="space-y-1 p-2">
					{members.map((member) => (
						<GroupMembersListItem member={member} key={member._id} />
					))}
				</div>
			</ScrollArea>
		</div>
	);
}

export default GroupMembersList;
