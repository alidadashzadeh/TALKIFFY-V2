import { Search } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import AccountSheet from "../AccountSheet/AccountSheet";
import { useConversationContext } from "@/contexts/ConversationContext";

function SidebarHeader() {
	const { setFilteredConversationsBy } = useConversationContext();
	const handleChange = (e) => {
		setFilteredConversationsBy(e.target.value);
	};

	return (
		<div className="flex items-center gap-2 px-2">
			<AccountSheet />
			<InputGroup className="m-2">
				<InputGroupInput placeholder="Search" onChange={handleChange} />
				<InputGroupAddon align="inline-start">
					<Search />
				</InputGroupAddon>
			</InputGroup>
		</div>
	);
}

export default SidebarHeader;
