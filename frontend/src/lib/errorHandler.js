import toast from "react-hot-toast";

export const handleErrorToast = (error) => {
	console.log(error);

	if (error?.response?.data?.message?.startsWith("E11000"))
		return toast.error("User Already exists");

	if (error?.name === "AxiosError")
		return toast.error(error?.response?.data?.message);

	return toast.error(error.message);
};
