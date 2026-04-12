import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { handleErrorToast } from "../../lib/errorHandler.js";
import { toast } from "sonner";
import validator from "validator";

function useLogin() {
	const queryClient = useQueryClient();

	const { mutateAsync: login, isPending: loading } = useMutation({
		mutationFn: async ({ email, password }) => {
			const trimmedEmail = email?.trim().toLowerCase();

			if (!trimmedEmail) {
				throw new Error("Email is required");
			}

			if (!validator.isEmail(trimmedEmail)) {
				throw new Error("Invalid email address");
			}
			const { data } = await axiosInstance.post("/users/login", {
				email: trimmedEmail,
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
