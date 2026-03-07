import { useAuthContext } from "@/contexts/AuthContext";
import { useSocketContext } from "@/contexts/SocketContext";
import { axiosInstance } from "@/utils/axios";
import { handleErrorToast } from "@/utils/errorHandler";
import { useState } from "react";
import toast from "react-hot-toast";

function useAddNewContact() {
	const [loading, setLoading] = useState(false);
	const [isContactAdded, setIsContactAdded] = useState(false);

	const { currentUser, setCurrentUser } = useAuthContext();
	const { onlineUsers, socket } = useSocketContext();

	const addNewContact = async ({ email }) => {
		setLoading(true);

		try {
			const normalizedEmail = email.trim().toLowerCase();

			if (!normalizedEmail) {
				throw new Error("Please provide an email address");
			}

			if (currentUser.email?.toLowerCase() === normalizedEmail) {
				throw new Error("You cannot add yourself to contacts");
			}

			const { data } = await axiosInstance.get(
				`/users?email=${normalizedEmail}`,
			);

			if (data.results === 0) {
				throw new Error("There is no user with the provided email");
			}

			const foundUser = data.data.doc[0];
			const contactId = foundUser._id;

			const alreadyExists = (currentUser.contacts || []).some((contact) => {
				if (typeof contact === "string") return contact === contactId;

				if (typeof contact === "object" && contact !== null) {
					return (
						contact._id === contactId ||
						contact.email?.toLowerCase() === normalizedEmail
					);
				}

				return false;
			});

			if (alreadyExists) {
				throw new Error("This user is already in your contact list");
			}

			if (onlineUsers.includes(contactId)) {
				socket.emit("setContacts", contactId);
			}

			await axiosInstance.patch(`/users/${currentUser._id}`, {
				contacts: [
					...(currentUser.contacts || []).map((contact) =>
						typeof contact === "object" ? contact._id : contact,
					),
					contactId,
				],
			});

			await axiosInstance.patch(`/users/${contactId}`, {
				contacts: [
					...(foundUser.contacts || []).map((contact) =>
						typeof contact === "object" ? contact._id : contact,
					),
					currentUser._id,
				],
			});

			const refreshedUser = await axiosInstance.get(
				`/users/${currentUser._id}`,
			);

			toast.success("Contact added successfully");
			setCurrentUser(refreshedUser.data.data.doc);
			setIsContactAdded(true);
		} catch (error) {
			handleErrorToast(error);
		} finally {
			setLoading(false);
		}
	};

	return { loading, addNewContact, isContactAdded, setIsContactAdded };
}

export default useAddNewContact;
