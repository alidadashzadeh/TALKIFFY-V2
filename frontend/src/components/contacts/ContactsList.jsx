import { useAuthContext } from "@/contexts/AuthContext";
import { useContactContext } from "@/contexts/ContactContext";
import ContactListItem from "./ContactListItem";

function ContactsList() {
	const { currentUser } = useAuthContext();
	const { filteredBy } = useContactContext();

	const contacts = currentUser?.contacts || [];
	const normalizedFilter = filteredBy?.trim().toLowerCase() || "";

	const filteredContacts = !normalizedFilter
		? contacts
		: contacts.filter((contact) => {
				const username = contact.username?.toLowerCase() || "";
				const email = contact.email?.toLowerCase() || "";

				return (
					username.includes(normalizedFilter) ||
					email.includes(normalizedFilter)
				);
			});

	if (!filteredContacts.length) {
		return (
			<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
				No contacts found
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col gap-1 overflow-y-auto p-1 pr-1">
			{filteredContacts.map((contact) => (
				<ContactListItem key={contact._id} contact={contact} />
			))}
		</div>
	);
}

export default ContactsList;
