import useLeaveGroup from "@/hooks/group/useLeaveGroup";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

function LeaveGroupBtn() {
	const { leaveGroup } = useLeaveGroup();

	const handleLeaveGroup = () => leaveGroup();
	return (
		<DropdownMenuItem
			onClick={handleLeaveGroup}
			className="text-red-500 focus:text-red-500"
		>
			<LogOut className="mr-2 h-4 w-4" />
			Leave Group
		</DropdownMenuItem>
	);
}

export default LeaveGroupBtn;
