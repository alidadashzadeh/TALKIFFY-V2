import { useConversationContext } from "@/contexts/ConversationContext";
import AvatarGenerator from "../AvatarGenerator";
import { getConversationDisplayData } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { H4, Muted } from "../ui/typography";
import GroupInfoActions from "../group/GroupInfoActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import GroupMembersList from "../group/GroupMembersList";
import useCurrentUser from "@/hooks/user/useCurrentUser ";

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
					<Muted>{currentConversation?.participants?.length} Members</Muted>
				</div>
			</div>

			{isGroup && isAdmin && <GroupInfoActions />}

			<Separator />

			{isGroup && (
				<div className="p-3">
					<Tabs defaultValue="members" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="members">Group Members</TabsTrigger>
							<TabsTrigger value="files">Shared Files</TabsTrigger>
						</TabsList>

						<TabsContent value="members" className="mt-4">
							<GroupMembersList members={currentConversation?.participants} />
						</TabsContent>

						<TabsContent value="files" className="mt-4">
							<div className="rounded-lg border p-4 text-sm text-muted-foreground">
								No shared files yet.
							</div>
						</TabsContent>
					</Tabs>
				</div>
			)}
		</div>
	);
}

export default ConversationInfoSidebar;
