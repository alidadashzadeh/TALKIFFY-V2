import { useEffect } from "react";

import { useAuthContext } from "../contexts/AuthContext";

import { axiosInstance } from "../lib/axios";
import { handleErrorToast } from "../lib/errorHandler";

function useSetDeliverOnLogin() {
	const { currentUser } = useAuthContext();

	useEffect(() => {
		if (!currentUser) return;
		const deliverOnLogin = async () => {
			try {
				await axiosInstance.patch("/messages/update-delivered", {
					receiverId: currentUser._id,
				});
			} catch (error) {
				handleErrorToast(error);
			}
		};

		deliverOnLogin();
	}, [currentUser]);
}

export default useSetDeliverOnLogin;
