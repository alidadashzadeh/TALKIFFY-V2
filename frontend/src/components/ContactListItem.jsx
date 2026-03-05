/* eslint-disable react/prop-types */

import { useContactContext } from "../contexts/ContactContext";
import { useSocketContext } from "../contexts/SocketContext";
import { useMessagesContext } from "../contexts/MessagesContext";

function ContactListItem({ contact }) {
	const { currentContactId, setCurrentContactId } = useContactContext();
	const { onlineUsers } = useSocketContext();
	const { unseenMessages, setUnseenMessages } = useMessagesContext();
	const isOnline = onlineUsers.includes(contact._id);
	const hasUnseenMessage = unseenMessages?.some(
		(message) => message.senderId === contact._id,
	);

	const handleClick = () => {
		setCurrentContactId(contact._id);
		setUnseenMessages((unseenMessages) =>
			unseenMessages?.filter((message) => message?.senderId !== contact._id),
		);
	};

	return (
		<div
			className={`relative flex gap-2 items-center justify-center  sm:justify-start cursor-pointer hover:bg-hover p-2 transition-all border-y-[1px] border-border ${
				currentContactId === contact._id ? "bg-select" : ""
			} `}
			onClick={() => {
				handleClick();
			}}
		>
			{/* <Avatar
				alt={contact.username}
				src={
					import.meta.env.MODE === "development"
						? `http://localhost:5001/avatars/${contact.avatar}`
						: `https://talkiffy.onrender.com/avatars/${contact.avatar}`
				}
			/> */}
			<div className="flex-col hidden sm:flex ">
				<p className=" font-bold text-text__primary lg:hidden">
					{contact.username.length < 6
						? contact.username
						: contact.username.slice(0, 6) + "..."}
				</p>
				<p className="font-bold text-text__primary hidden lg:block">
					{contact.username}
				</p>

				<p className="text-sm text-text__primary hidden lg:block">
					{contact.email}
				</p>
			</div>
			<div
				className={`w-2 h-2 rounded-full absolute left-10 top-10 ${
					isOnline ? "bg-green-500" : "bg-red-500"
				}`}
			/>
			{hasUnseenMessage && (
				<div className="absolute px-2 rounded-full right-4 top-[50%] translate-y-[-50%] bg-green-500 text-text__primary">
					{
						unseenMessages.filter((message) => message.senderId === contact._id)
							.length
					}
				</div>
			)}
		</div>
	);
}

export default ContactListItem;
