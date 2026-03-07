/* eslint-disable react/prop-types */

import { useConversationContext } from "@/contexts/ConversationContext";
import ConversationListItem from "./ConversationListItem";
import useGetMyConversations from "@/hooks/conversation/useGetMyConversations";
import ConversationLoader from "./ConversationLoader";

function ConversationList() {
	const { currentConversationId } = useConversationContext();

	const { conversations, loading } = useGetMyConversations();

	if (loading) {
		return <ConversationLoader />;
	}

	if (!conversations.length) {
		return <div>No conversations yet</div>;
	}

	return (
		<div className="flex flex-col gap-1">
			{conversations.map((conversation) => (
				<ConversationListItem
					key={conversation._id}
					conversation={conversation}
					isActive={currentConversationId === conversation._id}
				/>
			))}
		</div>
	);
}

export default ConversationList;
