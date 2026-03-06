/* eslint-disable react/prop-types */

import { useConversationContext } from "@/contexts/ConversationContext";
import ConversationListItem from "./ConversationListItem";
import useGetMyConversations from "@/hooks/conversation/useGetMyConversations";

function ConversationList() {
	const { currentConversationId, selectConversation } =
		useConversationContext();

	const { conversations, loading } = useGetMyConversations();
	if (loading) {
		return (
			<div className="flex min-h-[300px] items-center justify-center text-sm text-muted-foreground">
				Loading conversations...
			</div>
		);
	}

	if (!conversations.length) {
		return (
			<div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
				No conversations yet
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			{conversations.map((conversation) => (
				<ConversationListItem
					key={conversation._id}
					conversation={conversation}
					isActive={currentConversationId === conversation._id}
					onClick={selectConversation}
				/>
			))}
		</div>
	);
}

export default ConversationList;
