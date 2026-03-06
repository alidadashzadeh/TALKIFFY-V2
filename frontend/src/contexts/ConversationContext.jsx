/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
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
	const [currentConversation, setCurrentConversation] = useState(null);
	const [conversations, setConversations] = useState([]);

	const currentConversationId = currentConversation?._id || null;

	const clearCurrentConversation = () => {
		setCurrentConversation(null);
	};

	const value = useMemo(
		() => ({
			currentConversation,
			setCurrentConversation,
			currentConversationId,
			clearCurrentConversation,
			conversations,
			setConversations,
		}),
		[currentConversation, currentConversationId, conversations],
	);

	return (
		<ConversationContext.Provider value={value}>
			{children}
		</ConversationContext.Provider>
	);
};
