import useGetOrCreatePrivateConversation from "@/hooks/conversation/useGetOrCreatePrivateConversation";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";

function MessageMemberBtn({ member }) {
	const { getOrCreatePrivateConversation } =
		useGetOrCreatePrivateConversation();

	const memberId = member?._id;
	if (!memberId) return null;

	const handleMessageClick = () => {
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
