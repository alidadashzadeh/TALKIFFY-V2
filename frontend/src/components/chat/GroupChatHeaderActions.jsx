import { useState } from "react";
import { MoreVertical, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddMemberModal from "../group/AddMemberModal";
import SidePanelAction from "../ui/SidePanelAction";

import LeaveGroupBtn from "../buttons/LeaveGroupBtn";
import MuteChatBtn from "../buttons/MuteChatBtn";
function GroupChatHeaderActions() {
	const [showSearch, setShowSearch] = useState(false);
	const [searchValue, setSearchValue] = useState("");

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
					<MuteChatBtn />
					<DropdownMenuSeparator />
					<LeaveGroupBtn />
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default GroupChatHeaderActions;
