import validator from "validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { toast } from "sonner";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";

function useAddNewContact() {
	const { setAddContactModalOpen } = useSheetModalContext();
	const queryClient = useQueryClient();

	const { mutateAsync: addNewContact, isPending: loading } = useMutation({
		mutationFn: async ({ email }) => {
			const trimmedEmail = email?.trim().toLowerCase();

			if (!trimmedEmail) {
				throw new Error("Email is required");
			}

			if (!validator.isEmail(trimmedEmail)) {
				throw new Error("Invalid email address");
			}

			const { data } = await axiosInstance.post("/users/contacts", {
				email: trimmedEmail,
			});

			return {
				status: data?.status,
				user: data?.data?.user,
			};
		},
		retry: false,
		onSuccess: ({ status, user }) => {
			if (status !== "success") return;

			queryClient.setQueryData(["currentUser"], user);

			setAddContactModalOpen(false);

			toast.success("Contact added successfully");
		},

		onError: (error) => {
			handleErrorToast(error);
		},
	});

	return { loading, addNewContact };
}

export default useAddNewContact;
