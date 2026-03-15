import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";
import { useConversationContext } from "@/contexts/ConversationContext";
import { toast } from "sonner";

function useCreateGroupConversation() {
	const queryClient = useQueryClient();
	const { setAccountSheetOpen } = useSheetModalContext();
	const { selectConversation } = useConversationContext();

	const { mutateAsync: createGroupConversation, isPending: loading } =
		useMutation({
			mutationFn: async ({ name }) => {
				if (!name.trim()) return;

				const { data } = await axiosInstance.post("/conversations/group", {
					name: name.trim(),
				});
				return data?.data?.conversation;
			},

			onSuccess: (conversation) => {
				if (!conversation) return;
				selectConversation(conversation);
				queryClient.invalidateQueries({
					queryKey: ["conversations"],
				});
				setAccountSheetOpen(false);
				toast.success("Group created successfully");
			},

			onError: (error) => {
				handleErrorToast(error);
			},
		});

	return { loading, createGroupConversation };
}

export default useCreateGroupConversation;
