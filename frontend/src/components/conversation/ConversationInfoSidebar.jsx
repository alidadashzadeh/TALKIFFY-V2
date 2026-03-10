import { useConversationContext } from "@/contexts/ConversationContext";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";
import { Button } from "../ui/button";

function ConversationInfoSidebar() {
	const { setConversationInfoOpen } = useSheetModalContext();
	const { currentConversation } = useConversationContext();

	return (
		<div>
			{currentConversation?._id}
			<Button onClick={() => setConversationInfoOpen(false)}>Close</Button>
		</div>
	);
}

export default ConversationInfoSidebar;
