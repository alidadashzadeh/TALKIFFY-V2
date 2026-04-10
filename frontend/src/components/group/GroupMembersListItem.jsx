import AvatarGenerator from "../AvatarGenerator";
import { useConversationContext } from "@/contexts/ConversationContext";
import { getConversationDisplayData } from "@/lib/utils";
import GroupAdminActions from "./GroupAdminActions";
import GroupMemberActions from "./GroupMemberActions";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import { useSocketContext } from "@/contexts/SocketContext";
import OnlineStatusDot from "../ui/OnlineStatusDot";

function GroupMembersListItem({ member }) {
	const { currentConversation } = useConversationContext();

	const { data: currentUser } = useCurrentUser();
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
						<p className="truncate text-sm font-medium">{member?.username}</p>

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
						<p className="truncate text-xs text-muted-foreground">
							{member.email}
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
