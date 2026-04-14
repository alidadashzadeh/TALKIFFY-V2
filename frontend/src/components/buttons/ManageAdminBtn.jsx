import { Shield, ShieldXIcon } from "lucide-react";
import { Button } from "../ui/button";
import useAddGroupAdmin from "@/hooks/group/useAddGroupAdmin";
import useRemoveGroupAdmin from "@/hooks/group/useRemoveGroupAdmin";
import { useConversationContext } from "@/contexts/ConversationContext";
import { getConversationDisplayData } from "@/lib/utils";

function ManageAdminBtn({ member }) {
	const { currentConversation } = useConversationContext();
	const { addAdmin } = useAddGroupAdmin();
	const { removeAdmin } = useRemoveGroupAdmin();
	const { isAdmin } = getConversationDisplayData(
		currentConversation,
		member?._id,
	);
	const handleAddAdmin = () => {
		addAdmin(member?._id);
	};
	const handleRemoveAdmin = () => {
		removeAdmin(member?._id);
	};

	return (
		<div>
			{!isAdmin ? (
				<Button
					onClick={handleAddAdmin}
					variant="ghost"
					className="w-full justify-start"
				>
					<Shield className="mr-2 h-4 w-4" />
					Make admin
				</Button>
			) : (
				<Button
					onClick={handleRemoveAdmin}
					variant="ghost"
					className="w-full justify-start"
				>
					<ShieldXIcon className="mr-2 h-4 w-4" />
					Remove admin
				</Button>
			)}
		</div>
	);
}

export default ManageAdminBtn;
