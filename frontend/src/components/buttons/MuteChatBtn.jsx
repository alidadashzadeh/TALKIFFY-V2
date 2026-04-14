import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Volume2Icon } from "lucide-react";

function MuteChatBtn() {
	return (
		<DropdownMenuItem>
			<Volume2Icon className="mr-2 h-4 w-4" />
			Mute Chat
		</DropdownMenuItem>
	);
}

export default MuteChatBtn;
