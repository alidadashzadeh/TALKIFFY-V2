export function formatSeparatorDate(dateString) {
	const date = new Date(dateString);
	const today = new Date();
	const yesterday = new Date();

	yesterday.setDate(today.getDate() - 1);

	const isSameDay = (a, b) =>
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	if (isSameDay(date, today)) return "Today";
	if (isSameDay(date, yesterday)) return "Yesterday";

	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}
