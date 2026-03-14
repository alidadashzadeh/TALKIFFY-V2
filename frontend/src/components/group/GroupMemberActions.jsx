import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import MessageMemberBtn from "../buttons/MessageMemberBtn";
import MoreHorizontalBtn from "../buttons/MoreHorizontalBtn";

function GroupMemberActions({ member }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<MoreHorizontalBtn />
			</PopoverTrigger>

			<PopoverContent align="end" className="w-48 p-2">
				<div className="space-y-1">
					<MessageMemberBtn member={member} />
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default GroupMemberActions;
