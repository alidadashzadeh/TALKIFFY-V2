import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useAddGroupMember() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ conversationId, participants }) => {
			const { data } = await axiosInstance.patch(
				`/conversations/${conversationId}`,
				{ participants },
			);
			console.log(data);
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["conversations"],
			});
		},
	});

	return {
		addMemberToGroup: mutation.mutateAsync,
		loading: mutation.isPending,
		error: mutation.error,
	};
}

export default useAddGroupMember;
