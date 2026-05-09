import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupMembersList from "./GroupMembersList";
import SharedImages from "../conversation/SharedImages";

function GroupInfoContent() {
	return (
		<div className="flex h-full flex-col p-3">
			<Tabs defaultValue="members" className="flex h-full flex-col">
				<TabsList className="grid w-full grid-cols-2 shrink-0">
					<TabsTrigger value="members">Group Members</TabsTrigger>
					<TabsTrigger value="images">Shared Images</TabsTrigger>
				</TabsList>

				<TabsContent value="members" className="mt-4 flex-1 min-h-0">
					<GroupMembersList />
				</TabsContent>

				<TabsContent value="images" className="mt-4 flex-1 min-h-0">
					<SharedImages />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default GroupInfoContent;
