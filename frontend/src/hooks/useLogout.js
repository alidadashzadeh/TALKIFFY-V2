import { useState } from "react";

import { handleErrorToast } from "../lib/errorHandler";
import { useAuthContext } from "../contexts/AuthContext";

import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

function useLogout() {
	const [loading, setLoading] = useState(false);
	const { setCurrentUser } = useAuthContext();

	const logout = async () => {
		setLoading(true);

		try {
			const { data } = await axiosInstance.get("/users/logout");
			if (data.status === "success") {
				toast.success("Logged out successfully.");
				setCurrentUser(null);
			}
		} catch (error) {
			handleErrorToast(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
}

export default useLogout;
