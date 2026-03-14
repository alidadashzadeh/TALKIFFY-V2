import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";

function useUpdateUserAvatar() {
	const queryClient = useQueryClient();

	const { mutateAsync: updateUserAvatar, isPending: loading } = useMutation({
		mutationFn: async ({ userId, file }) => {
			if (!file || !userId) return null;

			const formData = new FormData();
			formData.append("avatar", file);

			const { data } = await axiosInstance.patch(`/users/${userId}`, formData);

			return data?.data?.user;
		},

		onSuccess: (updatedUser) => {
			if (!updatedUser) return;

			queryClient.setQueryData(["currentUser"], updatedUser);

			toast.success("Avatar updated successfully");
		},

		onError: (error) => {
			toast.error(error?.response?.data?.message || "Failed to update avatar");
		},
	});

	return { updateUserAvatar, loading };
}

export default useUpdateUserAvatar;
