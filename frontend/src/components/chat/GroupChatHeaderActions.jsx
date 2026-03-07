import {
	MoreVertical,
	UserPlus,
	Users,
	Search,
	Folder,
	Pencil,
	Shield,
	LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function GroupChatHeaderActions() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<MoreVertical className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuItem>
					<UserPlus className="mr-2 h-4 w-4" />
					Add Members
				</DropdownMenuItem>

				<DropdownMenuItem>
					<Users className="mr-2 h-4 w-4" />
					Group Info
				</DropdownMenuItem>

				<DropdownMenuItem>
					<Search className="mr-2 h-4 w-4" />
					Search Messages
				</DropdownMenuItem>

				<DropdownMenuItem>
					<Folder className="mr-2 h-4 w-4" />
					Shared Files
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
	);
}

export default GroupChatHeaderActions;
