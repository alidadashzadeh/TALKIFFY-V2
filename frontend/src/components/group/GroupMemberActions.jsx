import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";

function GroupMemberActions() {
	return (
		<div>
			<Button variant="ghost" className="h-8 w-8 shrink-0 rounded-full">
				<MessageSquare className="h-4 w-4" />
			</Button>
		</div>
	);
}

export default GroupMemberActions;
