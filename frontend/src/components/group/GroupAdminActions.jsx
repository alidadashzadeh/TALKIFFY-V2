import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import ManageAdminBtn from "../buttons/ManageAdminBtn";
import RemoveMemberBtn from "../buttons/RemoveMemberBtn";
import MessageMemberBtn from "../buttons/MessageMemberBtn";
import MoreHorizontalBtn from "../buttons/MoreHorizontalBtn";

function GroupAdminActions({ member }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<MoreHorizontalBtn />
			</PopoverTrigger>

			<PopoverContent align="end" className="w-48 p-2 space-y-1">
				<ManageAdminBtn member={member} />
				<MessageMemberBtn member={member} />
				<RemoveMemberBtn member={member} />
			</PopoverContent>
		</Popover>
	);
}

export default GroupAdminActions;
