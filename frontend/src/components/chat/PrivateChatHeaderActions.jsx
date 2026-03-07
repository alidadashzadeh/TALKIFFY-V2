import {
	MoreVertical,
	Phone,
	Video,
	Search,
	Folder,
	BellOff,
	Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function PrivateChatHeaderActions() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<MoreVertical className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-52">
				<DropdownMenuItem>
					<Phone className="mr-2 h-4 w-4" />
					Audio Call
				</DropdownMenuItem>

				<DropdownMenuItem>
					<Video className="mr-2 h-4 w-4" />
					Video Call
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem>
					<Search className="mr-2 h-4 w-4" />
					Search Messages
				</DropdownMenuItem>

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
	);
}

export default PrivateChatHeaderActions;
