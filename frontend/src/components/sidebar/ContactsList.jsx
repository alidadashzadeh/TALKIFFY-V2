import { useAuthContext } from "@/contexts/AuthContext";
import { useContactContext } from "@/contexts/ContactContext";
import ContactListItem from "./ContactListItem";

function ContactsList() {
	const { contacts } = useAuthContext();
	const { filteredBy } = useContactContext();

	const filteredContacts = !filteredBy
		? contacts
		: contacts.filter((contact) =>
				contact.username.toLowerCase().includes(filteredBy.toLowerCase()),
			);

	if (!filteredContacts?.length) {
		return (
			<div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
				No contacts found
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			{filteredContacts.map((contact) => (
				<ContactListItem key={contact._id} contact={contact} />
			))}
		</div>
	);
}

export default ContactsList;
