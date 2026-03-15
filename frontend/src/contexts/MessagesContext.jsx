/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useRef, useState } from "react";

const MessagesContext = createContext();

export const useMessagesContext = () => {
	return useContext(MessagesContext);
};

export const MessagesContextProvider = ({ children }) => {
	const [messages, setMessages] = useState([]);
	const [unseenMessages, setUnseenMessages] = useState([]);
	const [text, setText] = useState("");
	const [file, setFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState("");
	const [replyTo, setReplyTo] = useState(null);
	const textareaRef = useRef(null);

	useEffect(() => {
		if (!file) {
			setPreviewUrl("");
			return;
		}

		const localUrl = URL.createObjectURL(file);
		setPreviewUrl(localUrl);

		return () => {
			URL.revokeObjectURL(localUrl);
		};
	}, [file]);

	const clearMessageState = () => {
		setText("");
		setFile(null);
		setPreviewUrl("");
		setReplyTo(null);
		textareaRef.current.style.height = "auto";
	};
	return (
		<MessagesContext.Provider
			value={{
				messages,
				setMessages,
				unseenMessages,
				setUnseenMessages,
				text,
				setText,
				previewUrl,
				setPreviewUrl,
				file,
				setFile,
				replyTo,
				setReplyTo,
				clearMessageState,
				textareaRef,
			}}
		>
			{children}
		</MessagesContext.Provider>
	);
};
