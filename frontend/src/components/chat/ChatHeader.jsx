import { useAuthContext } from "@/contexts/AuthContext";
import { useConversationContext } from "@/contexts/ConversationContext";
import AvatarGenerator from "../AvatarGenerator";

function ChatHeader() {
	const { currentUser } = useAuthContext();
	const { currentConversation } = useConversationContext();

	const otherParticipant =
		currentConversation?.type === "private" &&
		currentConversation.participants?.find(
			(participant) => participant._id !== currentUser?._id,
		);

	return (
		<header className="w-full border-b bg-background px-4 py-3">
			<div className="flex min-w-0 items-center gap-3">
				<AvatarGenerator
					avatar={otherParticipant.avatar}
					name={otherParticipant.username}
				/>

				<div className="min-w-0">
					<h2 className="truncate font-semibold">
						{otherParticipant.username}
					</h2>
				</div>
			</div>
		</header>
	);
}

export default ChatHeader;
