/* eslint-disable react/prop-types */

import { useMemo } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

import { useConversationContext } from "@/contexts/ConversationContext";
import AvatarGenerator from "../AvatarGenerator";
import { Muted, P } from "../ui/typography";

function ConversationListItem({ conversation, isActive = false }) {
	const { currentUser } = useAuthContext();
	const { selectConversation } = useConversationContext();

	const otherUser = useMemo(() => {
		if (conversation.type === "group") return null;

		return conversation.participants?.find(
			(user) => user._id !== currentUser?._id,
		);
	}, [conversation, currentUser]);

	return (
		<button
			type="button"
			onClick={() => selectConversation(conversation)}
			className={cn(
				"flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-accent",
				isActive && "bg-accent",
			)}
		>
			<AvatarGenerator avatar={otherUser?.avatar} name={otherUser?.username} />

			{/* fix preview of last message goes here */}
			<div className="min-w-0 flex-1">
				<P className="truncate font-medium">{otherUser?.username}</P>
				<Muted className="truncate font-medium">{otherUser?.email}</Muted>
				{/* <p className="truncate text-sm text-muted-foreground">
					{lastMessagePreview}
				</p> */}
			</div>
			{/*
			{formattedTime && (
				<span className="shrink-0 text-xs text-muted-foreground">
					{formattedTime}
				</span>
			)} */}
		</button>
	);
}

export default ConversationListItem;
