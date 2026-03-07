import { useAuthContext } from "@/contexts/AuthContext";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

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

export function isSameCalendarDay(dateA, dateB) {
	const a = new Date(dateA);
	const b = new Date(dateB);

	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

export const getAvatarUrl = (avatar) => {
	if (!avatar) return "";

	if (avatar.startsWith("http")) return avatar;

	const baseURL =
		import.meta.env.MODE === "development"
			? "http://localhost:5001"
			: "https://talkiffy.onrender.com";

	return `${baseURL}/avatars/${avatar}`;
};

export const getInitials = (text = "") => {
	return text.trim().slice(0, 2).toUpperCase();
};

export function getOtherUser(conversation, currentUserId) {
	if (conversation?.type !== "private") return null;

	return (
		conversation.participants?.find((user) => user._id !== currentUserId) ??
		null
	);
}

export function getMessageSenderId(senderId) {
	if (!senderId) return null;
	return typeof senderId === "string" ? senderId : senderId._id;
}

export function isMyMessage(message, currentUserId) {
	return getMessageSenderId(message?.senderId) === currentUserId;
}

export function getMessageDisplayData(message, currentUser, currentContact) {
	const isMe = isMyMessage(message, currentUser?._id);

	return {
		isMe,
		username: isMe ? currentUser?.username : currentContact?.username,
		avatarFile: isMe ? currentUser?.avatar : currentContact?.avatar,
	};
}
