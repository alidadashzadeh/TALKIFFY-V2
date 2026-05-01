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

	const memberId = member?._id;
	if (!memberId) return null;

	const { isAdmin } = getConversationDisplayData(currentConversation, memberId);
	const handleClick = () => {
		isAdmin ? removeAdmin(memberId) : addAdmin(memberId);
	};

	return (
		<Button
			onClick={handleClick}
			variant="ghost"
			className="w-full justify-start"
		>
			{isAdmin ? (
				<>
					<ShieldXIcon className="mr-2 h-4 w-4" />
					Remove admin
				</>
			) : (
				<>
					<Shield className="mr-2 h-4 w-4" />
					Make admin
				</>
			)}
		</Button>
	);
}

export default ManageAdminBtn;
