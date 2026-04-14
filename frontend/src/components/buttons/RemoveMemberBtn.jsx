import { UserMinus } from "lucide-react";
import { Button } from "../ui/button";
import useRemoveGroupMember from "@/hooks/group/useRemoveGroupMember";

function RemoveMemberBtn({ member }) {
	const { removeParticipant, loading } = useRemoveGroupMember();

	const handleRemoveMember = () => {
		removeParticipant(member?._id);
	};
	return (
		<Button
			variant="ghost"
			className="w-full justify-start text-destructive hover:text-destructive"
			onClick={handleRemoveMember}
			disabled={loading}
		>
			<UserMinus className="mr-2 h-4 w-4" />
			{loading ? "Removing..." : "Remove"}
		</Button>
	);
}

export default RemoveMemberBtn;
