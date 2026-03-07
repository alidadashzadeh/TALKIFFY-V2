import { useEffect } from "react";

import { useMessagesContext } from "../contexts/MessagesContext";
import { useAuthContext } from "../contexts/AuthContext";

import { handleErrorToast } from "../lib/errorHandler";
import { axiosInstance } from "../lib/axios";

function useGetUnseenMessagesOnLogin() {
	const { setUnseenMessages } = useMessagesContext();
	const { currentUser } = useAuthContext();

	useEffect(() => {
		if (!currentUser) return;

		const deliverMessage = async () => {
			try {
				const { data } = await axiosInstance.get(
					"/messages/check-unseen-messages",
				);

				if (data.status === "success") setUnseenMessages(data.data.messages);
			} catch (error) {
				handleErrorToast(error);
			}
		};

		deliverMessage();
	}, [currentUser, setUnseenMessages]);
}

export default useGetUnseenMessagesOnLogin;
