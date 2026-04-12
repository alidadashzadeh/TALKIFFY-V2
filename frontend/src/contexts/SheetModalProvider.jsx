import { createContext, useContext, useState } from "react";

const SheetModalContext = createContext();

function SheetModalProvider({ children }) {
	const [accountSheetOpen, setAccountSheetOpen] = useState(false);
	const [contactModalOpen, setContactModalOpen] = useState(false);
	const [addContactModalOpen, setAddContactModalOpen] = useState(false);
	const [groupModalOpen, setGroupModalOpen] = useState(false);
	const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
	const [conversationInfoOpen, setConversationInfoOpen] = useState(false);
	const [editGroupModalOpen, setEditGroupModalOpen] = useState(false);
	return (
		<SheetModalContext.Provider
			value={{
				accountSheetOpen,
				setAccountSheetOpen,
				contactModalOpen,
				setContactModalOpen,
				groupModalOpen,
				setGroupModalOpen,
				addMemberModalOpen,
				setAddMemberModalOpen,
				conversationInfoOpen,
				setConversationInfoOpen,
				editGroupModalOpen,
				setEditGroupModalOpen,
				addContactModalOpen,
				setAddContactModalOpen,
			}}
		>
			{children}
		</SheetModalContext.Provider>
	);
}

function useSheetModalContext() {
	const context = useContext(SheetModalContext);

	if (!context) {
		throw new Error(
			"useSheetModalContext must be used within SheetModalProvider",
		);
	}

	return context;
}

export { SheetModalProvider, useSheetModalContext };
