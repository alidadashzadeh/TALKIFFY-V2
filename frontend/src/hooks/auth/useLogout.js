import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { handleErrorToast } from "../../lib/errorHandler";
import { toast } from "sonner";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";
import { useConversationContext } from "@/contexts/ConversationContext";

function useLogout() {
	const queryClient = useQueryClient();
	const { setAccountSheetOpen } = useSheetModalContext();
	const { selectConversation } = useConversationContext();
	const { mutateAsync: logout, isPending: loading } = useMutation({
		mutationFn: async () => {
			const { data } = await axiosInstance.get("/users/logout");
			return data;
		},

		onSuccess: (data) => {
			if (data.status === "success") {
				queryClient.removeQueries({ queryKey: ["conversations"] });
				queryClient.setQueryData(["currentUser"], null);
				setAccountSheetOpen(false);
				selectConversation(null);
				toast.success("Logged out successfully.");
			}
		},

		onError: (error) => {
			handleErrorToast(error);
		},
	});

	return { logout, loading };
}

export default useLogout;
