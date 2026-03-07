import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";

function useGetMyConversations() {
	const query = useQuery({
		queryKey: ["conversations"],

		queryFn: async () => {
			const { data } = await axiosInstance.get("/conversations");

			return data?.data?.conversations || [];
		},

		onError: (error) => {
			handleErrorToast(error);
		},
	});

	return query;
}

export default useGetMyConversations;
