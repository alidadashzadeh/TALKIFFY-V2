import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddMemberModal from "../group/AddMemberModal";
import SidePanelActionBtn from "../buttons/SidePanelActionBtn";

import LeaveGroupBtn from "../buttons/LeaveGroupBtn";
import MuteChatBtn from "../buttons/MuteChatBtn";
import MessageSearchPopover from "../message/MessageSearchPopover";
function GroupChatHeaderActions() {
	return (
		<div className="flex items-center gap-1">
			<AddMemberModal />
			<MessageSearchPopover />
			<SidePanelActionBtn />

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button type="button" variant="ghost" size="icon">
						<MoreVertical className="h-5 w-5" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-56">
					<MuteChatBtn />
					<DropdownMenuSeparator />
					<LeaveGroupBtn />
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default GroupChatHeaderActions;
