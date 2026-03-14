import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import useAddGroupMember from "@/hooks/group/useAddGroupMember";

function AddMemberBtn({ contact }) {
	const { addMemberToGroup, loading } = useAddGroupMember();
	const handleAddMember = () => addMemberToGroup(contact._id);

	return (
		<Button
			type="button"
			size="icon"
			variant="ghost"
			onClick={handleAddMember}
			disabled={loading}
			aria-label={`Add ${contact?.username}`}
		>
			{loading ? <Spinner /> : <UserPlus className="h-5 w-5" />}
		</Button>
	);
}

export default AddMemberBtn;
