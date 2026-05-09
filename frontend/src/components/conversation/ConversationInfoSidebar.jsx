import { useConversationContext } from "@/contexts/ConversationContext";
import AvatarGenerator from "../AvatarGenerator";
import { getConversationDisplayData } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { H4 } from "../ui/typography";
import GroupInfoActions from "../group/GroupInfoActions";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import GroupMembersCount from "../group/GroupMembersCount";
import GroupInfoContent from "../group/GroupInfoContent";
import SharedImages from "./SharedImages";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";

function ConversationInfoSidebar() {
	const { currentConversation } = useConversationContext();
	const { currentUser } = useCurrentUser();
	const { setConversationInfoOpen } = useSheetModalContext();

	const { name, avatar, isGroup, isAdmin } = getConversationDisplayData(
		currentConversation,
		currentUser?._id,
	);

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-start justify-between p-4">
				<div className="flex-1" />

				<Button
					variant="ghost"
					size="icon"
					onClick={() => setConversationInfoOpen(false)}
				>
					<X className="h-5 w-5" />
				</Button>
			</div>

			<div className="flex flex-col items-center justify-center gap-4 pb-4">
				<AvatarGenerator avatar={avatar} name={name} size="w-24 h-24" />

				<div className="flex flex-col items-center">
					<H4>{name}</H4>

					{isGroup && <GroupMembersCount />}
				</div>
			</div>

			{isGroup && isAdmin && <GroupInfoActions />}

			<Separator />

			<div className="min-h-0 flex-1">
				{isGroup ? <GroupInfoContent /> : <SharedImages />}
			</div>
		</div>
	);
}

export default ConversationInfoSidebar;
