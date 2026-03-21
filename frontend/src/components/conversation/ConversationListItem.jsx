/* eslint-disable react/prop-types */

import {
	cn,
	formatMessageTime,
	getConversationDisplayData,
	truncateText,
} from "@/lib/utils";

import { useConversationContext } from "@/contexts/ConversationContext";
import AvatarGenerator from "../AvatarGenerator";
import { Muted, P } from "../ui/typography";
import useCurrentUser from "@/hooks/user/useCurrentUser ";

function ConversationListItem({ conversation, isActive = false }) {
	const { data: currentUser } = useCurrentUser();
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
			<div className="flex-col w-full">
				<div className="min-w-0 flex-1 flex justify-between items-center ">
					<P className="truncate font-medium">
						{truncateText(displayData?.name, 15)}
					</P>

					<Muted className="shrink-0 text-xs">
						{formatMessageTime(conversation?.lastMessageAt)}
					</Muted>
				</div>
				<div className=" flex gap-2 items-baseline">
					{conversation?.type === "group" && (
						<P className="text-blue-500 text-sm">
							@
							{truncateText(
								conversation?.lastMessageId?.senderId?.username,
								10,
							)}{" "}
							:
						</P>
					)}
					<Muted className="truncate text-sm text-muted-foreground">
						{truncateText(conversation?.lastMessageId?.content, 10)}
					</Muted>
				</div>
			</div>
		</button>
	);
}

export default ConversationListItem;
