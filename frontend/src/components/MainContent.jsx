import { useEffect, useRef } from "react";

import { useContactContext } from "../contexts/ContactContext";
import { useMessagesContext } from "../contexts/MessagesContext";

import MessageItem from "./MessageItem";
import MessageHeader from "./MessageHeader";
import MessageBar from "./MessageBar";
import MessageLoading from "./MessageLoading";
import useGetMessages from "../hooks/useGetMessages";

function MainContent() {
	const { currentContactId, setCurrentContactId } = useContactContext();
	const { messages } = useMessagesContext();
	const { loading, getMessages } = useGetMessages();
	const chatContainerRef = useRef(null);

	// to get messages as soon as a contact has been selected
	useEffect(() => {
		if (!currentContactId) return;
		getMessages();
	}, [currentContactId, getMessages]);

	// to scroll to the bottom of the messages
	useEffect(() => {
		const container = chatContainerRef.current;
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	}, [messages]);

	// to clean up the currentContactId on unmount
	useEffect(() => {
		return () => {
			setCurrentContactId(null);
		};
	}, [setCurrentContactId]);

	if (loading) return <MessageLoading />;

	return (
		// <div className=" flex flex-col justify-between items-center w-full h-full bg-background__secondary">
		// 	{!currentContactId && (
		// 		<div className="w-full h-full flex justify-center items-center text-xl font-bold text-text__primary">
		// 			Select a contact to start talking!
		// 		</div>
		// 	)}
		// 	{currentContactId && (
		// 		<>
		// 			<div className=" w-full">
		// 				<MessageHeader />
		// 			</div>

		// 			<div
		// 				className="w-full overflow-y-scroll h-full p-2"
		// 				ref={chatContainerRef}
		// 			>
		// 				{messages?.length === 0 ? (
		// 					<div className="w-full h-full flex justify-center text-xl text-text__primary pt-8">
		// 						No message yet! say Hi 👋
		// 					</div>
		// 				) : (
		// 					messages?.map((message) => (
		// 						<MessageItem message={message} key={message._id} />
		// 					))
		// 				)}
		// 			</div>
		// 			<div className="w-full  ">
		// 				<MessageBar loading={loading} />
		// 			</div>
		// 		</>
		// 	)}
		// </div>
		<div>main</div>
	);
}

export default MainContent;
