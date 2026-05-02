import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import useGetOrCreatePrivateConversation from "@/hooks/conversation/useGetOrCreatePrivateConversation";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";

function StartPrivateChatBtn({ contact }) {
	const { setAccountSheetOpen, setContactModalOpen } = useSheetModalContext();
	const { getOrCreatePrivateConversation, loading } =
		useGetOrCreatePrivateConversation();

	const contactId = contact?._id;

	const handleClick = () => {
		if (!contactId) return;

		getOrCreatePrivateConversation(contactId);
		setAccountSheetOpen(false);
		setContactModalOpen(false);
	};
	return (
		<Button
			type="button"
			size="icon"
			variant="ghost"
			onClick={handleClick}
			aria-label={`Message ${contact?.username}`}
		>
			{loading ? <Spinner /> : <MessageSquare className="h-5 w-5" />}
		</Button>
	);
}

export default StartPrivateChatBtn;
