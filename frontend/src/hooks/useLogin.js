import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import { handleErrorToast } from "../lib/errorHandler";
import { toast } from "sonner";

function useLogin() {
	const queryClient = useQueryClient();

	const { mutateAsync: login, isPending: loading } = useMutation({
		mutationFn: async ({ email, password }) => {
			const { data } = await axiosInstance.post("/users/login", {
				email,
				password,
			});

			return data;
		},

		onSuccess: (data) => {
			if (data.status === "success") {
				queryClient.setQueryData(["currentUser"], data?.data?.user);
				toast.success("Logged in successfully.");
			}
		},

		onError: (error) => {
			handleErrorToast(error);
		},
	});

	return { loading, login };
}

export default useLogin;
