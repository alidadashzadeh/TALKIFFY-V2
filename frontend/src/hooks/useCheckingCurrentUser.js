import { useCallback, useState } from "react";

import { useAuthContext } from "./../contexts/AuthContext.jsx";
import { axiosInstance } from "../lib/axios.js";
import { handleErrorToast } from "../lib/errorHandler.js";

function useCheckCurrentUser() {
	const [loading, setLoading] = useState(true);
	const { setCurrentUser } = useAuthContext();

	const checkAuth = useCallback(async () => {
		try {
			const data = await axiosInstance.get("/users/check");

			setCurrentUser(data?.data.data.user);
		} catch (error) {
			setCurrentUser(null);
			handleErrorToast(error);
		} finally {
			setLoading(false);
		}
	}, []);

	return { loading, checkAuth };
}

export default useCheckCurrentUser;
