import { useState } from "react";
import {
	MoreVertical,
	Search,
	Pencil,
	Shield,
	LogOut,
	X,
	Volume2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddMemberModal from "../conversation/AddMemberModal";
import SidePanelAction from "../ui/SidePanelAction";
import useLeaveGroup from "@/hooks/group/useLeaveGroup";
import { useConversationContext } from "@/contexts/ConversationContext";
function GroupChatHeaderActions() {
	const [showSearch, setShowSearch] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const { leaveGroup } = useLeaveGroup();
	const { currentConversation } = useConversationContext();
	const handleLeaveGroup = async () => {
		if (!currentConversation?._id) return;
		await leaveGroup(currentConversation._id);
	};

	const handleCloseSearch = () => {
		setShowSearch(false);
		setSearchValue("");
	};

	return (
		<div className="flex items-center gap-1">
			<AddMemberModal />
			{showSearch ? (
				<div className="flex items-center gap-2">
					<div className="w-48 sm:w-56">
						<Input
							autoFocus
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							placeholder="Search messages..."
							className="h-9"
						/>
					</div>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={handleCloseSearch}
					>
						<X className="h-5 w-5" />
					</Button>
				</div>
			) : (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => setShowSearch(true)}
				>
					<Search className="h-5 w-5" />
				</Button>
			)}
			<SidePanelAction />

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button type="button" variant="ghost" size="icon">
						<MoreVertical className="h-5 w-5" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-56">
					<DropdownMenuItem>
						<Volume2Icon className="mr-2 h-4 w-4" />
						Mute Group
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onClick={handleLeaveGroup}
						className="text-red-500 focus:text-red-500"
					>
						<LogOut className="mr-2 h-4 w-4" />
						Leave Group
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default GroupChatHeaderActions;
