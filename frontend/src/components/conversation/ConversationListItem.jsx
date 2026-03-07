/* eslint-disable react/prop-types */

import { useAuthContext } from "@/contexts/AuthContext";
import { cn, getConversationDisplayData } from "@/lib/utils";

import { useConversationContext } from "@/contexts/ConversationContext";
import AvatarGenerator from "../AvatarGenerator";
import { Muted, P } from "../ui/typography";

function ConversationListItem({ conversation, isActive = false }) {
	const { currentUser } = useAuthContext();
	const { selectConversation } = useConversationContext();

	const handleSelectConversation = () => {
		selectConversation(conversation);
	};

	const displayData = getConversationDisplayData(
		conversation,
		currentUser?._id,
	);

	return (
		<button
			type="button"
			onClick={handleSelectConversation}
			className={cn(
				"flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-accent",
				isActive && "bg-accent",
			)}
		>
			<AvatarGenerator avatar={displayData?.avatar} name={displayData?.name} />

			<div className="min-w-0 flex-1">
				<P className="truncate font-medium">{displayData?.name}</P>
				{displayData?.email && (
					<Muted className="truncate font-medium">{displayData?.email}</Muted>
				)}
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
