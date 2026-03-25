import { useEffect } from "react";

import { axiosInstance } from "../lib/axios";
import { handleErrorToast } from "../lib/errorHandler";
import useCurrentUser from "./user/useCurrentUser";

function useSetDeliverOnLogin() {
	const { data: currentUser } = useCurrentUser();

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
