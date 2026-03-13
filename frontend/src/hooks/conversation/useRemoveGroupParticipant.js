import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function useRemoveGroupParticipant() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ conversationId, userId }) => {
			const res = await axiosInstance.delete(
				`/conversations/${conversationId}/participants/${userId}`,
			);

			return res.data;
		},

		onSuccess: () => {
			queryClient.invalidateQueries(["conversations"]);
		},
	});

	return {
		removeParticipant: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error,
	};
}

export default useRemoveGroupParticipant;
