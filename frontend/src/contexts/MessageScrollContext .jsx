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
	const highlightTimeoutRef = useRef(null);
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
		const id = String(messageId);
		const node = messageRefs.current.get(id);

		if (!node) return;

		node.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});

		if (highlightTimeoutRef.current) {
			clearTimeout(highlightTimeoutRef.current);
		}

		setHighlightedMessageId(null);

		requestAnimationFrame(() => {
			setHighlightedMessageId(id);

			highlightTimeoutRef.current = setTimeout(() => {
				setHighlightedMessageId(null);
				highlightTimeoutRef.current = null;
			}, 2500);
		});
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
