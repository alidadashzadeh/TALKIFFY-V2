import { MessageCircleMore } from "lucide-react";
import { Muted } from "../ui/typography";

function EmptyConversationList() {
	return (
		<>
			<div className="flex h-full flex-col items-center justify-center gap-2 px-2 text-center md:hidden">
				<div className="rounded-lg border border-muted  p-2">
					<MessageCircleMore className="h-5 w-5 text-muted" />
				</div>
				<Muted className="text-xs leading-tight">No chats</Muted>
			</div>
			<div className="p-4 text-center hidden md:flex items-center justify-center">
				No conversations found
			</div>
		</>
	);
}

export default EmptyConversationList;
