/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useCurrentUser from "@/hooks/user/useCurrentUser";

export const SocketContext = createContext(null);

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);

	const { data: currentUser, isLoading } = useCurrentUser();

	useEffect(() => {
		if (isLoading) return;

		if (!currentUser?._id) {
			setSocket(null);
			setOnlineUsers([]);
			return;
		}

		const newSocket = io(
			import.meta.env.MODE === "development"
				? "http://localhost:5001"
				: "https://talkiffy.onrender.com",
			{
				withCredentials: true,
			},
		);

		setSocket(newSocket);

		const handlePresenceUpdate = (userIds) => {
			setOnlineUsers(userIds);
		};

		newSocket.on("presence:update", handlePresenceUpdate);

		return () => {
			newSocket.off("presence:update", handlePresenceUpdate);
			newSocket.disconnect();
		};
	}, [currentUser?._id, isLoading]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
