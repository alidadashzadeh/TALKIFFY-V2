import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { toast } from "sonner";

function useAddNewContact() {
	const queryClient = useQueryClient();

	const { mutateAsync: addNewContact, isPending: loading } = useMutation({
		mutationFn: async ({ email }) => {
			const trimmedEmail = email?.trim();
			if (!trimmedEmail) {
				throw new Error("Email is required");
			}
			const { data } = await axiosInstance.post("/users/contacts", { email });
			return data?.data?.user;
		},

		onSuccess: (user) => {
			queryClient.setQueryData(["currentUser"], user);
			toast.success("Contact added successfully");
		},

		onError: (error) => {
			handleErrorToast(error);
		},
	});

	return { loading, addNewContact };
}

export default useAddNewContact;
