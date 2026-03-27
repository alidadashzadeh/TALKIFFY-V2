import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function useSocketListeners(socket) {
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!socket) return;

		const handleContactAdded = () => {
			queryClient.invalidateQueries({
				queryKey: ["currentUser"],
			});

			toast.success("You have a new contact");
		};

		socket.on("contact:added", handleContactAdded);

		return () => {
			socket.off("contact:added", handleContactAdded);
		};
	}, [socket, queryClient]);
}

export default useSocketListeners;
