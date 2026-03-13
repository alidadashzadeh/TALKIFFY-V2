import { useSheetModalContext } from "@/contexts/SheetModalProvider";
import { Button } from "../ui/button";
import { Pencil, UserPlus } from "lucide-react";
import EditGroupInfoModal from "./EditGroupInfoModal";

function GroupInfoActions() {
	const { setAddMemberModalOpen, setEditGroupModalOpen } =
		useSheetModalContext();
	return (
		<div className="flex gap-2 justify-center p-4">
			<Button
				variant="ghost"
				className="justify-start"
				onClick={() => setEditGroupModalOpen(true)}
			>
				<Pencil className="mr-2 h-4 w-4" />
				Edit Info
			</Button>

			<Button
				variant="ghost"
				className="justify-start"
				onClick={() => setAddMemberModalOpen(true)}
			>
				<UserPlus className="mr-2 h-4 w-4" />
				Add Members
			</Button>
			<EditGroupInfoModal />
		</div>
	);
}

export default GroupInfoActions;
