import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { handleErrorToast } from "../../lib/errorHandler.js";
import { toast } from "sonner";
import validator from "validator";

function useSignup() {
	const queryClient = useQueryClient();

	const { mutateAsync: signup, isPending: loading } = useMutation({
		mutationFn: async ({ email, username, password, passwordConfirm }) => {
			const trimmedEmail = email?.trim().toLowerCase();
			const trimmedUsername = username?.trim();

			if (!trimmedEmail) {
				throw new Error("Email is required.");
			}

			if (!validator.isEmail(trimmedEmail)) {
				throw new Error("Please provide a valid email address.");
			}

			if (!trimmedUsername) {
				throw new Error("Username is required.");
			}

			if (trimmedUsername.length > 20) {
				throw new Error("Username cannot be more than 20 characters.");
			}

			if (!password) {
				throw new Error("Password is required.");
			}

			if (password.length < 8) {
				throw new Error("Password must be at least 8 characters.");
			}

			if (!passwordConfirm) {
				throw new Error("Please confirm your password.");
			}

			if (password !== passwordConfirm) {
				throw new Error("Passwords do not match.");
			}

			const { data } = await axiosInstance.post("/users/signup", {
				email: trimmedEmail,
				username: trimmedUsername,
				password,
				passwordConfirm,
			});

			return data;
		},

		onSuccess: (data) => {
			if (data?.status !== "success") return;

			queryClient.setQueryData(["currentUser"], data?.data?.user);
			toast.success("User created successfully.");
		},

		onError: handleErrorToast,
		retry: false,
	});

	return { signup, loading };
}

export default useSignup;
