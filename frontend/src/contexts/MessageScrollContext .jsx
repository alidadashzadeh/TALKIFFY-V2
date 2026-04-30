// contexts/MessageScrollContext.jsx
import {
	createContext,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";

const MessageScrollContext = createContext(null);

export function MessageScrollProvider({ children }) {
	const messageRefs = useRef(new Map());
	const [highlightedMessageId, setHighlightedMessageId] = useState(null);

	const registerMessageRef = useCallback((messageId, node) => {
		if (!messageId) return;

		const id = String(messageId);

		if (node) {
			messageRefs.current.set(id, node);
		} else {
			messageRefs.current.delete(id);
		}
	}, []);

	const scrollToMessage = useCallback((messageId) => {
		const node = messageRefs.current.get(String(messageId));
		if (!node) return;

		node.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});

		setHighlightedMessageId(String(messageId));

		setTimeout(() => {
			setHighlightedMessageId(null);
		}, 1500);
	}, []);

	return (
		<MessageScrollContext.Provider
			value={{
				registerMessageRef,
				scrollToMessage,
				highlightedMessageId,
			}}
		>
			{children}
		</MessageScrollContext.Provider>
	);
}

export function useMessageScroll() {
	const ctx = useContext(MessageScrollContext);
	if (!ctx) {
		throw new Error("useMessageScroll must be used inside provider");
	}
	return ctx;
}
