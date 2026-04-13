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
				return {
					status: data?.status,
					conversation: data?.data?.conversation,
				};
			},

			onSuccess: ({ status, conversation }) => {
				if (status !== "success") return;

				selectConversation(conversation);

				queryClient.setQueryData(["conversations"], (oldConversations = []) => {
					const exists = oldConversations.some(
						(item) => item._id === conversation._id,
					);

					if (!exists) {
						return [conversation, ...oldConversations];
					}

					return oldConversations.map((item) =>
						item._id === conversation._id ? conversation : item,
					);
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
