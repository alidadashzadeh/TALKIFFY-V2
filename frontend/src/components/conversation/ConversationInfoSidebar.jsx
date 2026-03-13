import { useConversationContext } from "@/contexts/ConversationContext";
import AvatarGenerator from "../AvatarGenerator";
import { useAuthContext } from "@/contexts/AuthContext";
import { getConversationDisplayData } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { P } from "../ui/typography";
import GroupInfoActions from "../group/GroupInfoActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import GroupMembersList from "../group/GroupMembersList";

function ConversationInfoSidebar() {
	const { currentConversation } = useConversationContext();
	const { currentUser } = useAuthContext();

	const { name, avatar, isGroup, isAdmin } = getConversationDisplayData(
		currentConversation,
		currentUser?._id,
	);

	return (
		<div>
			<div className="relative flex items-center justify-center gap-4 py-4">
				<AvatarGenerator avatar={avatar} name={name} size="w-24 h-24" />
				<P>{name}</P>
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
