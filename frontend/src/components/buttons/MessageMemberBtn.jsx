import useGetOrCreatePrivateConversation from "@/hooks/conversation/useGetOrCreatePrivateConversation";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";

function MessageMemberBtn({ member }) {
	const { getOrCreatePrivateConversation } =
		useGetOrCreatePrivateConversation();

	const memberId = member?._id;

	const handleMessageClick = () => {
		if (!memberId) return;
		getOrCreatePrivateConversation(memberId);
	};

	return (
		<Button
			variant="ghost"
			className="w-full justify-start"
			onClick={handleMessageClick}
		>
			<MessageSquare className="mr-2 h-4 w-4" />
			Message
		</Button>
	);
}

export default MessageMemberBtn;
