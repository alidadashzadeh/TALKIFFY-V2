export function filterContacts({ contacts = [], search = "" }) {
	const normalizedFilter = search.trim().toLowerCase();

	if (!normalizedFilter) return contacts;

	return contacts.filter((contact) => {
		const username = contact?.username?.toLowerCase() || "";
		const email = contact?.email?.toLowerCase() || "";

		return (
			username.includes(normalizedFilter) || email.includes(normalizedFilter)
		);
	});
}
