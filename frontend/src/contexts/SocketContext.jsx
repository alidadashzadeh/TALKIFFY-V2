/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

import { io } from "socket.io-client";
import useCurrentUser from "@/hooks/user/useCurrentUser ";

export const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);

	const { data: currentUser } = useCurrentUser();

	useEffect(() => {
		if (currentUser) {
			const socket = io(
				import.meta.env.MODE === "development"
					? "http://localhost:5001"
					: "https://talkiffy.onrender.com",
			);
			setSocket(socket);

			socket.emit("setOnlineUsers", currentUser);

			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			return () => socket.close();
		} else if (socket) {
			socket.close();
			setSocket(null);
		}
	}, [currentUser]);

	return (
		<SocketContext.Provider
			value={{ socket, setSocket, onlineUsers, setOnlineUsers }}
		>
			{children}
		</SocketContext.Provider>
	);
};
