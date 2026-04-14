import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { handleErrorToast } from "@/lib/errorHandler";

function useUpdateUserAvatar() {
	const queryClient = useQueryClient();

	const { mutateAsync: updateUserAvatar, isPending: loading } = useMutation({
		mutationFn: async ({ userId, file }) => {
			const formData = new FormData();
			formData.append("avatar", file);

			const { data } = await axiosInstance.patch(`/users/${userId}`, formData);

			if (data?.status !== "success" || !data?.data?.user) {
				throw new Error(data?.message || "Failed to update user avatar");
			}

			return data.data.user;
		},

		onMutate: async ({ userId, file }) => {
			if (!file || !userId) {
				throw new Error("File and user ID are required");
			}

			const previewUrl = URL.createObjectURL(file);

			await queryClient.cancelQueries({ queryKey: ["currentUser"] });

			const previousCurrentUser = queryClient.getQueryData(["currentUser"]);

			queryClient.setQueryData(["currentUser"], (oldUser) =>
				oldUser ? { ...oldUser, avatar: previewUrl } : oldUser,
			);

			return {
				previousCurrentUser,

				previewUrl,
			};
		},

		onSuccess: (updatedUser) => {
			const realUrl = updatedUser.avatar;

			const img = new window.Image();
			img.src = realUrl;

			img.onload = () => {
				queryClient.setQueryData(["currentUser"], updatedUser);
			};

			toast.success("Avatar updated successfully");
		},

		onError: (error, variables, context) => {
			if (context?.previousCurrentUser) {
				queryClient.setQueryData(["currentUser"], context.previousCurrentUser);
			}

			const message =
				error?.response?.data?.message || "Failed to update avatar";
			handleErrorToast(message);
		},

		onSettled: (data, error, variables, context) => {
			if (context?.previewUrl) {
				URL.revokeObjectURL(context.previewUrl);
			}
		},
	});

	return { updateUserAvatar, loading };
}

export default useUpdateUserAvatar;
