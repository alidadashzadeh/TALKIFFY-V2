import { UserMinus } from "lucide-react";
import { Button } from "../ui/button";
import useRemoveGroupMember from "@/hooks/group/useRemoveGroupMember";

function RemoveMemberBtn({ member }) {
	const { removeParticipant } = useRemoveGroupMember();

	const memberId = member?._id;

	const handleRemoveMember = () => {
		if (!memberId) return;
		removeParticipant(memberId);
	};
	return (
		<Button
			variant="ghost"
			className="w-full justify-start text-destructive hover:text-destructive"
			onClick={handleRemoveMember}
		>
			<UserMinus className="mr-2 h-4 w-4" />
			Remove
		</Button>
	);
}

export default RemoveMemberBtn;
