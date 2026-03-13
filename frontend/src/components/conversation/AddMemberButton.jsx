import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useConversationContext } from "@/contexts/ConversationContext";
import useAddGroupMember from "@/hooks/group/useAddGroupMember";

function AddMemberButton({ contact }) {
	const { currentConversation } = useConversationContext();
	const { addMemberToGroup, loading } = useAddGroupMember();

	const handleAddMember = async () => {
		try {
			const participantIds = currentConversation.participants.map(
				(participant) =>
					typeof participant === "string" ? participant : participant._id,
			);

			if (participantIds.includes(contact._id)) return;
			await addMemberToGroup({
				conversationId: currentConversation._id,
				// participants: [...participantIds, contact._id],
				userId: contact._id,
			});
		} catch (error) {
			console.error("Failed to add member:", error);
		}
	};

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

export default AddMemberButton;
