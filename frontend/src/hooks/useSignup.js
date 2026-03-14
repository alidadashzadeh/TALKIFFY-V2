import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import { handleErrorToast } from "../lib/errorHandler.js";
import { toast } from "sonner";

function useSignup() {
	const queryClient = useQueryClient();

	const { mutateAsync: signup, isPending: loading } = useMutation({
		mutationFn: async ({ email, username, password, passwordConfirm }) => {
			const { data } = await axiosInstance.post("/users/signup", {
				email,
				username,
				password,
				passwordConfirm,
			});

			return data;
		},

		onSuccess: (data) => {
			if (data.status === "success") {
				queryClient.setQueryData(["currentUser"], data?.data?.user);
				toast.success("User created successfully.");
			}
		},

		onError: (error) => {
			handleErrorToast(error);
		},
	});

	return { signup, loading };
}

export default useSignup;
