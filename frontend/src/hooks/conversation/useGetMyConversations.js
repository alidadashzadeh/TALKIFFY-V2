import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { useEffect } from "react";

function useGetMyConversations() {
	const {
		data: conversations = [],
		isPending: loading,
		isError,
		error,
	} = useQuery({
		queryKey: ["conversations"],

		queryFn: async () => {
			const { data } = await axiosInstance.get("/conversations");

			return data?.data?.conversations || [];
		},
		retry: false,
	});

	useEffect(() => {
		if (isError) {
			handleErrorToast(error);
		}
	}, [isError, error]);

	return { conversations, loading };
}

export default useGetMyConversations;
