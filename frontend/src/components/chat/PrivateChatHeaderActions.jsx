import { useState } from "react";
import {
	MoreVertical,
	Phone,
	Video,
	Search,
	Folder,
	BellOff,
	Trash2,
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

function PrivateChatHeaderActions() {
	const [showSearch, setShowSearch] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	const handleCloseSearch = () => {
		setShowSearch(false);
		setSearchValue("");
	};

	return (
		<div className="flex items-center gap-1">
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
				<>
					<Button type="button" variant="ghost" size="icon">
						<Phone className="h-5 w-5" />
					</Button>

					<Button type="button" variant="ghost" size="icon">
						<Video className="h-5 w-5" />
					</Button>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => setShowSearch(true)}
					>
						<Search className="h-5 w-5" />
					</Button>
				</>
			)}

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button type="button" variant="ghost" size="icon">
						<MoreVertical className="h-5 w-5" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-52">
					<DropdownMenuItem>
						<Folder className="mr-2 h-4 w-4" />
						Shared Files
					</DropdownMenuItem>

					<DropdownMenuItem>
						<BellOff className="mr-2 h-4 w-4" />
						Mute Chat
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem className="text-red-500 focus:text-red-500">
						<Trash2 className="mr-2 h-4 w-4" />
						Delete Chat
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default PrivateChatHeaderActions;
