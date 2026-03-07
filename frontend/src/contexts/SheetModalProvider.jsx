import { createContext, useContext, useState } from "react";

const SheetModalContext = createContext();

function SheetModalProvider({ children }) {
	const [accountSheetOpen, setAccountSheetOpen] = useState(false);
	const [contactModalOpen, setContactModalOpen] = useState(false);
	const [groupModalOpen, setGroupModalOpen] = useState(false);

	return (
		<SheetModalContext.Provider
			value={{
				accountSheetOpen,
				setAccountSheetOpen,
				contactModalOpen,
				setContactModalOpen,
				groupModalOpen,
				setGroupModalOpen,
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
