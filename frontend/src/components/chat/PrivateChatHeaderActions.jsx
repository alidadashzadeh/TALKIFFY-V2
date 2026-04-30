import { MoreVertical, Folder, BellOff, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MessageSearchPopover from "../message/MessageSearchPopover";

function PrivateChatHeaderActions() {
	return (
		<div className="flex items-center gap-1">
			<MessageSearchPopover />

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
