import { useAuthContext } from "@/contexts/AuthContext";
import { useContactContext } from "@/contexts/ContactContext";
import ContactListItem from "./ContactListItem";

function ContactsList() {
	const { contacts } = useAuthContext();
	const { filteredBy } = useContactContext();

	const filteredContacts = !filteredBy
		? contacts
		: contacts.filter((contact) => contact.username.includes(filteredBy));
	return (
		<div className=" overflow-y-auto">
			{filteredContacts.map((contact, i) => (
				<ContactListItem key={i} contact={contact} />
			))}
		</div>
	);
}

export default ContactsList;
