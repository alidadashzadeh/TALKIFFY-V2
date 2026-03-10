import { useState } from "react";
import {
	MoreVertical,
	UserPlus,
	Search,
	Folder,
	Pencil,
	Shield,
	LogOut,
	X,
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
import { useSheetModalContext } from "@/contexts/SheetModalProvider";
import AddMemberModal from "../conversation/AddMemberModal";
import SidePanelAction from "../ui/SidePanelAction";

function GroupChatHeaderActions() {
	const [showSearch, setShowSearch] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const { setAddMemberModalOpen } = useSheetModalContext();
	// const { conversationInfoOpen, setConversationInfoOpen } =
	// 	useSheetModalContext();

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
					<DropdownMenuItem onClick={() => setAddMemberModalOpen(true)}>
						<UserPlus className="mr-2 h-4 w-4" />
						Add Members
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem>
						<Pencil className="mr-2 h-4 w-4" />
						Rename Group
					</DropdownMenuItem>

					<DropdownMenuItem>
						<Shield className="mr-2 h-4 w-4" />
						Manage Admins
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem className="text-red-500 focus:text-red-500">
						<LogOut className="mr-2 h-4 w-4" />
						Leave Group
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default GroupChatHeaderActions;
