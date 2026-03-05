import ContactsList from "../ContactsList";

import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebarheader from "./Sidebarheader";

function Sidebar() {
	return (
		<div className="h-full flex flex-col">
			<Sidebarheader />

			<ScrollArea className="flex-1">
				<ContactsList />
			</ScrollArea>
		</div>
	);
}

export default Sidebar;
