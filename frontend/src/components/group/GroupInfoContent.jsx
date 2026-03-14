import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupMembersList from "./GroupMembersList";
import SharedFiles from "../conversation/SharedFiles";
import { useConversationContext } from "@/contexts/ConversationContext";

function GroupInfoContent() {
	const { currentConversation } = useConversationContext();

	return (
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
					<SharedFiles />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default GroupInfoContent;
