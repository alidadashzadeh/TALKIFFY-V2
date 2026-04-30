import { useMemo } from "react";

function useMessageSearch(messages = [], query = "") {
	return useMemo(() => {
		if (!Array.isArray(messages)) return [];
		if (!query.trim()) return [];

		const q = query.toLowerCase();

		return messages
			.filter((message) => message.content?.toLowerCase().includes(q))
			.slice(0, 30);
	}, [messages, query]);
}

export default useMessageSearch;
