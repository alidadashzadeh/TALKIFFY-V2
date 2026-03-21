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

export function formatDateKey(date) {
	const d = new Date(date);
	return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
}

export function formatSectionDate(date) {
	const d = new Date(date);
	const now = new Date();

	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	const current = new Date(d.getFullYear(), d.getMonth(), d.getDate());

	if (current.getTime() === today.getTime()) return "Today";
	if (current.getTime() === yesterday.getTime()) return "Yesterday";

	return d.toLocaleDateString([], {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function formatMessageTime(date) {
	if (!date) return "";

	const d = new Date(date);
	const now = new Date();

	const isToday = d.toDateString() === now.toDateString();

	const isYesterday =
		new Date(now.setDate(now.getDate() - 1)).toDateString() ===
		d.toDateString();

	if (isToday) {
		return d.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	if (isYesterday) {
		return "Yesterday";
	}

	return d.toLocaleDateString([], {
		month: "short",
		day: "numeric",
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
export function getConversationDisplayData(conversation, currentUserId) {
	if (!conversation) return null;

	if (conversation.type === "group") {
		return {
			name: conversation.name || "Unnamed Group",
			avatar: conversation.avatar || "",
			email: "",
			isGroup: true,
			isAdmin: conversation.admins?.some(
				(admin) => String(admin?._id || admin) === String(currentUserId),
			),
		};
	}

	const otherUser =
		conversation.participants?.find((user) => user._id !== currentUserId) ??
		null;

	return {
		name: otherUser?.username || "",
		avatar: otherUser?.avatar || "",
		email: otherUser?.email || "",
		isGroup: false,
		isAdmin: false,
	};
}

export function getMessageSenderId(senderId) {
	if (!senderId) return null;
	return typeof senderId === "string" ? senderId : senderId._id;
}

export function isMyMessage(message, currentUserId) {
	return getMessageSenderId(message?.senderId) === currentUserId;
}

export function getMessageDisplayData(message, currentUser) {
	const isMe = isMyMessage(message, currentUser?._id);

	return {
		isMe,
		username: isMe ? currentUser?.username : message?.senderId?.username,
		avatar: isMe ? currentUser?.avatar : message?.senderId?.avatar,
	};
}

export function truncateText(text, maxLength = 40) {
	if (!text) return "";
	return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
}
