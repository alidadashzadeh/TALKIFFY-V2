import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { useAuthContext } from "@/contexts/AuthContext";

function useUpdateUserAvatar() {
	const queryClient = useQueryClient();
	const { currentUser, setCurrentUser } = useAuthContext();

	const { mutateAsync: updateUserAvatar, isPending: loading } = useMutation({
		mutationFn: async ({ userId, file }) => {
			if (!file || !userId) return;

			const formData = new FormData();
			formData.append("avatar", file);

			const { data } = await axiosInstance.patch(`/users/${userId}`, formData);

			return data;
		},

		onSuccess: (data) => {
			// console.log(data);
			// console.log("currentUser", currentUser);
			// queryClient.invalidateQueries({ queryKey: ["authUser"] });
			// queryClient.invalidateQueries({ queryKey: ["user"] });

			setCurrentUser(data?.data.user);

			toast.success("Avatar updated successfully");
		},

		onError: (error) => {
			toast.error(error?.response?.data?.message || "Failed to update avatar");
		},
	});

	return { updateUserAvatar, loading };
}

export default useUpdateUserAvatar;
