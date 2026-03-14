import { axiosInstance } from "@/lib/axios.js";
import { useQuery } from "@tanstack/react-query";

export const getCurrentUser = async () => {
	const { data } = await axiosInstance.get("/users/check");
	return data?.data?.user;
};

function useCurrentUser() {
	return useQuery({
		queryKey: ["currentUser"],
		queryFn: getCurrentUser,
		retry: false,
		staleTime: 5 * 60 * 1000,
	});
}

export default useCurrentUser;
