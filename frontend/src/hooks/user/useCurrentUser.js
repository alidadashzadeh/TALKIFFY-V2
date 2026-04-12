import { axiosInstance } from "@/lib/axios.js";
import { handleErrorToast } from "@/lib/errorHandler";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const getCurrentUser = async () => {
	const { data } = await axiosInstance.get("/users/check");
	return data?.data?.user;
};

function useCurrentUser() {
	const {
		data: currentUser,
		isPending: loading,
		isError,
		error,
	} = useQuery({
		queryKey: ["currentUser"],
		queryFn: async () => {
			const { data } = await axiosInstance.get("/users/check");
			return data?.data?.user;
		},
		retry: false,
		staleTime: 5 * 60 * 1000,
	});
	useEffect(() => {
		if (isError) {
			handleErrorToast(error);
		}
	}, [isError, error]);

	return { currentUser, loading };
}

export default useCurrentUser;
