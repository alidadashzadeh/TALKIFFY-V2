import { useConversationContext } from "@/contexts/ConversationContext";
import AvatarGenerator from "../AvatarGenerator";
import { getConversationDisplayData } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { H4 } from "../ui/typography";
import GroupInfoActions from "../group/GroupInfoActions";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import GroupMembersCount from "../group/GroupMembersCount";
import GroupInfoContent from "../group/GroupInfoContent";
import SharedFiles from "./SharedFiles";

function ConversationInfoSidebar() {
	const { currentConversation } = useConversationContext();
	const { data: currentUser } = useCurrentUser();

	const { name, avatar, isGroup, isAdmin } = getConversationDisplayData(
		currentConversation,
		currentUser?._id,
	);

	return (
		<div>
			<div className="relative flex flex-col items-center justify-center gap-4 py-4">
				<AvatarGenerator avatar={avatar} name={name} size="w-24 h-24" />
				<div className=" flex flex-col justify-center items-center">
					<H4>{name}</H4>
					<GroupMembersCount />
				</div>
			</div>

			{isGroup && isAdmin && <GroupInfoActions />}

			<Separator />

			{isGroup ? <GroupInfoContent /> : <SharedFiles />}
		</div>
	);
}

export default ConversationInfoSidebar;
