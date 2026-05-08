import ConversationList from "../conversation/ConversationList";
import SidebarHeader from "./SidebarHeader";
import { ScrollArea } from "@/components/ui/scroll-area";

function Sidebar() {
	return (
		<aside className="h-full w-full bg-background border-none">
			<div className="flex h-full flex-col">
				<div className="flex justify-center items-center">
					<SidebarHeader />
				</div>

				<ScrollArea className="flex-1">
					<div className="p-2">
						<ConversationList />
					</div>
				</ScrollArea>
			</div>
		</aside>
	);
}

export default Sidebar;
