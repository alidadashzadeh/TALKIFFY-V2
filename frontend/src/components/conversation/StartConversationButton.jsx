/* eslint-disable react/prop-types */

import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import useGetOrCreatePrivateConversation from "@/hooks/conversation/useGetOrCreatePrivateConversation";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";
import { useConversationContext } from "@/contexts/ConversationContext";

function StartConversationButton({ contact }) {
	const { selectConversation } = useConversationContext();
	const { setAccountSheetOpen, setContactModalOpen } = useSheetModalContext();
	const { getOrCreatePrivateConversation, loading } =
		useGetOrCreatePrivateConversation();

	const handleMessageClick = async () => {
		try {
			const conversation = await getOrCreatePrivateConversation(contact?._id);
			setAccountSheetOpen(false);
			setContactModalOpen(false);

			if (conversation?.data?.conversation?._id) {
				selectConversation(conversation);
			}
		} catch (error) {
			console.error("Failed to get or create conversation:", error);
		}
	};
	return (
		<Button
			type="button"
			size="icon"
			variant="ghost"
			onClick={handleMessageClick}
			aria-label={`Message ${contact?.username}`}
		>
			{loading ? <Spinner /> : <MessageSquare className="h-5 w-5" />}
		</Button>
	);
}

export default StartConversationButton;
