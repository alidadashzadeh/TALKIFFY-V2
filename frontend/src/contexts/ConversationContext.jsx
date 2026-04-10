/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import useGetMyConversations from "@/hooks/conversation/useGetMyConversations";
import { createContext, useContext, useMemo, useState } from "react";

const ConversationContext = createContext();

export const useConversationContext = () => {
	const context = useContext(ConversationContext);

	if (!context) {
		throw new Error(
			"useConversationContext must be used within a ConversationContextProvider",
		);
	}

	return context;
};

export const ConversationContextProvider = ({ children }) => {
	const [currentConversationId, setCurrentConversationId] = useState(null);
	const [filteredConversationsBy, setFilteredConversationsBy] = useState("");

	const { data: conversations = [] } = useGetMyConversations();

	const currentConversation =
		conversations.find(
			(conversation) => conversation._id === currentConversationId,
		) || null;

	const selectConversation = (conversation) => {
		setCurrentConversationId(conversation?._id || null);
	};

	const clearCurrentConversation = () => {
		setCurrentConversationId(null);
	};

	const value = useMemo(
		() => ({
			currentConversation,
			currentConversationId,
			selectConversation,
			clearCurrentConversation,
			conversations,
			filteredConversationsBy,
			setFilteredConversationsBy,
		}),
		[
			currentConversation,
			currentConversationId,
			conversations,
			filteredConversationsBy,
		],
	);

	return (
		<ConversationContext.Provider value={value}>
			{children}
		</ConversationContext.Provider>
	);
};
