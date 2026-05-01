import { createContext, useContext, useEffect, useState } from "react";
import { useConversationContext } from "./ConversationContext";
import { getOtherUser } from "@/lib/utils";
import useCurrentUser from "@/hooks/user/useCurrentUser";

const ContactContext = createContext();

export const useContactContext = () => {
	return useContext(ContactContext);
};

export const ContactContextProvider = ({ children }) => {
	const [openAddContactModal, setOpenAddContactModal] = useState(false);
	const [currentContactId, setCurrentContactId] = useState(null);
	const [currentContact, setCurrentContact] = useState(null);
	const [filteredBy, setFilteredBy] = useState("");

	const { currentUser } = useCurrentUser();
	const { currentConversation } = useConversationContext();

	useEffect(() => {
		const otherUser = getOtherUser(currentConversation, currentUser?._id);
		setCurrentContact(otherUser);
		setCurrentContactId(otherUser?._id);
	}, [currentConversation, currentUser]);

	return (
		<ContactContext.Provider
			value={{
				openAddContactModal,
				setOpenAddContactModal,
				currentContactId,
				setCurrentContactId,
				filteredBy,
				setFilteredBy,
				currentContact,
				setCurrentContact,
			}}
		>
			{children}
		</ContactContext.Provider>
	);
};
