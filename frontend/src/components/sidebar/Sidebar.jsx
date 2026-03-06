import ContactsList from "../contacts/ContactsList";
import SidebarHeader from "./SidebarHeader";
import { ScrollArea } from "@/components/ui/scroll-area";

function Sidebar() {
	return (
		<aside className="h-full w-full border-r bg-background">
			<div className="flex h-full flex-col">
				<div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<SidebarHeader />
				</div>

				<ScrollArea className="flex-1">
					<div className="p-2">
						<ContactsList />
					</div>
				</ScrollArea>
			</div>
		</aside>
	);
}

export default Sidebar;
