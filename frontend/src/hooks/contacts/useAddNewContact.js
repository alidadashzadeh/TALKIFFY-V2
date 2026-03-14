import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSocketContext } from "@/contexts/SocketContext";
import { axiosInstance } from "@/lib/axios";
import { handleErrorToast } from "@/lib/errorHandler";
import { toast } from "sonner";
import { useState } from "react";

function useAddNewContact() {
	const queryClient = useQueryClient();
	const { onlineUsers, socket } = useSocketContext();
	const [isContactAdded, setIsContactAdded] = useState(false);

	const { mutateAsync: addNewContact, isPending: loading } = useMutation({
		mutationFn: async ({ email }) => {
			const { data } = await axiosInstance.post("/users/contacts", { email });
			return data?.data;
		},

		onSuccess: (data) => {
			queryClient.setQueryData(["currentUser"], data?.user);

			if (data?.contactId && onlineUsers.includes(data.contactId)) {
				socket.emit("setContacts", data.contactId);
			}

			toast.success("Contact added successfully");
			setIsContactAdded(true);
		},

		onError: (error) => {
			handleErrorToast(error);
		},
	});

	return { loading, addNewContact, isContactAdded, setIsContactAdded };
}

export default useAddNewContact;
