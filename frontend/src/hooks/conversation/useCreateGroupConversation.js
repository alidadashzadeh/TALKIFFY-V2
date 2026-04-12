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
				const trimmedName = name.trim();
				if (!trimmedName) throw new Error("Group name cannot be empty");

				const { data } = await axiosInstance.post("/conversations/group", {
					name: trimmedName,
				});
				return data;
			},

			onSuccess: (data) => {
				if (data.status !== "success") return;

				selectConversation(data?.data?.conversation);

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
