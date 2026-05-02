import { getMessageDisplayData } from "@/lib/utils";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import ReplyCard from "../ui/ReplyCard";
import { useMessageScroll } from "@/contexts/MessageScrollContext ";

function ReplyMessage({ replyMessage, isMe }) {
	const { currentUser } = useCurrentUser();
	const { scrollToMessage } = useMessageScroll();

	if (!replyMessage) return null;

	const { username } = getMessageDisplayData(replyMessage, currentUser);

	return (
		<ReplyCard
			username={username}
			message={replyMessage}
			isMe={isMe}
			onClick={() => scrollToMessage(replyMessage._id)}
		/>
	);
}

export default ReplyMessage;
