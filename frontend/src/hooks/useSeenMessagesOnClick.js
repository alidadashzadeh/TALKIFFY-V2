import { useEffect } from "react";

import { useContactContext } from "../contexts/ContactContext";
import { useSocketContext } from "../contexts/SocketContext";

import { axiosInstance } from "../lib/axios";

function useSeenMessagesOnClick() {
	const { currentContactId } = useContactContext();
	const { socket } = useSocketContext();

	useEffect(() => {
		if (!currentContactId) return;

		const makeMessagesSeen = async () => {
			try {
				await axiosInstance.patch("/messages/update-seen", {
					senderId: currentContactId,
				});
			} catch (error) {
				console.log(error);
			}
		};

		makeMessagesSeen();
	}, [currentContactId, socket]);
}

export default useSeenMessagesOnClick;
