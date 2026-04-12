/* eslint-disable react/prop-types */

import { useConversationContext } from "@/contexts/ConversationContext";

import useGetMyConversations from "@/hooks/conversation/useGetMyConversations";

import ConversationListItem from "./ConversationListItem";
import ConversationLoader from "./ConversationLoader";
import { filterConversations } from "@/lib/utils/conversation";
import useCurrentUser from "@/hooks/user/useCurrentUser";

function ConversationList() {
	const { currentUser } = useCurrentUser();
	const { currentConversationId, filteredConversationsBy } =
		useConversationContext();

	const { conversations, loading } = useGetMyConversations();

	const filteredConversations = filterConversations({
		conversations,
		search: filteredConversationsBy || "",
		currentUserId: currentUser?._id,
	});

	if (loading) {
		return <ConversationLoader />;
	}

	if (!filteredConversations.length) {
		return <div className="p-8 text-center">No conversations found</div>;
	}

	return (
		<div className="flex flex-col gap-1 ">
			{filteredConversations.map((conversation) => (
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
