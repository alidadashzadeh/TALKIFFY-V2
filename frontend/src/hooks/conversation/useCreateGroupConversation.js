import { useState } from "react";
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
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [error, setError] = useState("");

	const resetState = () => {
		setName("");
		setError("");
	};

	const mutation = useMutation({
		mutationFn: async (payload) => {
			const { data } = await axiosInstance.post(
				"/conversations/group",
				payload,
			);
			selectConversation(data?.conversation);
			return data?.conversation;
		},

		onSuccess: () => {
			toast.success("Group Created Successfully");
			queryClient.invalidateQueries({
				queryKey: ["conversations"],
			});
			setAccountSheetOpen(false);
		},

		onError: (error) => {
			handleErrorToast(error);
		},
	});

	const handleOpenChange = (value) => {
		setOpen(value);

		if (!value) {
			resetState();
		}
	};

	const handleCreateGroup = async (e) => {
		e.preventDefault();

		const trimmedName = name.trim();

		if (!trimmedName) {
			setError("Group name is required");
			return;
		}

		try {
			setError("");

			await mutation.mutateAsync({
				name: trimmedName,
			});

			resetState();
			setOpen(false);
		} catch (err) {
			setError(err?.response?.data?.message || "Failed to create group");
		}
	};

	return {
		open,
		name,
		error,
		loading: mutation.isPending,
		setName,
		handleOpenChange,
		handleCreateGroup,
	};
}

export default useCreateGroupConversation;
