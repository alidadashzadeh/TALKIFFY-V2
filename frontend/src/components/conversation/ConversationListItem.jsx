/* eslint-disable react/prop-types */

import { useMemo } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function ConversationListItem({ conversation, isActive = false, onClick }) {
	const { currentUser } = useAuthContext();

	const otherUser = useMemo(() => {
		if (conversation.isGroup) return null;

		return conversation.participants?.find(
			(user) => user._id !== currentUser?._id,
		);
	}, [conversation, currentUser]);

	const displayName = useMemo(() => {
		if (conversation.isGroup) {
			return conversation.groupName || "Unnamed group";
		}

		return otherUser?.username || otherUser?.email || "Unknown user";
	}, [conversation, otherUser]);

	const avatar = useMemo(() => {
		if (conversation.isGroup) {
			return conversation.groupAvatar || null;
		}

		return otherUser?.avatar || null;
	}, [conversation, otherUser]);

	const lastMessagePreview = useMemo(() => {
		const lastMessage = conversation.lastMessageId;

		if (!lastMessage) return "No messages yet";

		if (lastMessage.text) return lastMessage.text;
		if (lastMessage.type === "image") return "📷 Image";
		if (lastMessage.type === "video") return "🎥 Video";
		if (lastMessage.type === "audio") return "🎤 Voice message";
		if (lastMessage.type === "file") return "📎 File";

		return "New message";
	}, [conversation]);

	const formattedTime = useMemo(() => {
		if (!conversation.lastMessageAt) return "";

		return new Date(conversation.lastMessageAt).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	}, [conversation]);

	const fallback = displayName?.charAt(0)?.toUpperCase() || "?";

	return (
		<button
			type="button"
			onClick={() => onClick?.(conversation)}
			className={cn(
				"flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-accent",
				isActive && "bg-accent",
			)}
		>
			{/* Avatar */}
			<Avatar className="h-10 w-10">
				<AvatarImage src={avatar} alt={displayName} />
				<AvatarFallback>{fallback}</AvatarFallback>
			</Avatar>

			{/* Text */}
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium">{displayName}</p>
				<p className="truncate text-sm text-muted-foreground">
					{lastMessagePreview}
				</p>
			</div>

			{/* Time */}
			{formattedTime && (
				<span className="shrink-0 text-xs text-muted-foreground">
					{formattedTime}
				</span>
			)}
		</button>
	);
}

export default ConversationListItem;
