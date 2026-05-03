import AvatarGenerator from "../AvatarGenerator";
import { useConversationContext } from "@/contexts/ConversationContext";
import { getConversationDisplayData, truncateText } from "@/lib/utils";
import GroupAdminActions from "./GroupAdminActions";
import GroupMemberActions from "./GroupMemberActions";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import { useSocketContext } from "@/contexts/SocketContext";
import OnlineStatusDot from "../ui/OnlineStatusDot";

function GroupMembersListItem({ member }) {
	const { currentConversation } = useConversationContext();

	const { currentUser } = useCurrentUser();
	const { onlineUsers } = useSocketContext();

	const { isAdmin } = getConversationDisplayData(
		currentConversation,
		member?._id,
	);
	const { isAdmin: isCurrentUserAdmin } = getConversationDisplayData(
		currentConversation,
		currentUser?._id,
	);
	const isYou = currentUser?._id === member?._id;
	const isOnline = onlineUsers.includes(member?._id);
	return (
		<div
			key={member?._id}
			className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-muted/60"
		>
			<div className="flex min-w-0 items-center gap-3 ">
				<div className="relative">
					<AvatarGenerator avatar={member?.avatar} name={member?.username} />
					<OnlineStatusDot isOnline={isOnline} />
				</div>

				<div className="min-w-0">
					<div className="flex items-center gap-2">
						<p className="text-sm font-medium">
							{truncateText(member?.username, 20)}
						</p>

						{isAdmin && (
							<span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
								Admin
							</span>
						)}
						{isYou && (
							<span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
								You
							</span>
						)}
					</div>

					{member?.email && (
						<p className="text-xs text-muted-foreground">
							{truncateText(member.email, 35)}
						</p>
					)}
				</div>
			</div>
			{!isYou && (
				<div>
					{isCurrentUserAdmin ? (
						<GroupAdminActions member={member} />
					) : (
						<GroupMemberActions member={member} />
					)}
				</div>
			)}
		</div>
	);
}

export default GroupMembersListItem;
