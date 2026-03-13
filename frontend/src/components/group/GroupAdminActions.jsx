import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import {
	MessageSquare,
	MoreHorizontal,
	Shield,
	ShieldXIcon,
	UserMinus,
} from "lucide-react";
import { useConversationContext } from "@/contexts/ConversationContext";
import { getConversationDisplayData } from "@/lib/utils";

function GroupAdminActions({ member }) {
	const { currentConversation } = useConversationContext();

	const { isAdmin } = getConversationDisplayData(
		currentConversation,
		member?._id,
	);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 shrink-0 rounded-full"
				>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</PopoverTrigger>

			<PopoverContent align="end" className="w-48 p-2">
				<div className="space-y-1">
					{!isAdmin ? (
						<Button variant="ghost" className="w-full justify-start">
							<Shield className="mr-2 h-4 w-4" />
							Make admin
						</Button>
					) : (
						<Button variant="ghost" className="w-full justify-start">
							<ShieldXIcon className="mr-2 h-4 w-4" />
							Remove admin
						</Button>
					)}

					<Button variant="ghost" className="w-full justify-start">
						<MessageSquare className="mr-2 h-4 w-4" />
						Message
					</Button>

					<Button
						variant="ghost"
						className="w-full justify-start text-destructive hover:text-destructive"
					>
						<UserMinus className="mr-2 h-4 w-4" />
						Remove
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default GroupAdminActions;
