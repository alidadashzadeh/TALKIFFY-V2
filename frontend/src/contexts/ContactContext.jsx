/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const ContactContext = createContext();

export const useContactContext = () => {
	return useContext(ContactContext);
};

export const ContactContextProvider = ({ children }) => {
	const [openAddContactModal, setOpenAddContactModal] = useState(false);
	const [currentContactId, setCurrentContactId] = useState(null);
	const [filteredBy, setFilteredBy] = useState("");

	return (
		<ContactContext.Provider
			value={{
				openAddContactModal,
				setOpenAddContactModal,
				currentContactId,
				setCurrentContactId,
				filteredBy,
				setFilteredBy,
			}}
		>
			{children}
		</ContactContext.Provider>
	);
};
