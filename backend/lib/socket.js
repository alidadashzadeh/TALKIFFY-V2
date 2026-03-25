import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin:
			process.env.NODE_ENV === "production"
				? "https://talkiffy-frontend.onrender.com"
				: "http://localhost:5173",
		credentials: true,
	},
});

const onlineUsersMap = new Map();

const addUserSocket = (userId, socketId) => {
	const normalizedUserId = String(userId);

	if (!onlineUsersMap.has(normalizedUserId)) {
		onlineUsersMap.set(normalizedUserId, new Set());
	}

	onlineUsersMap.get(normalizedUserId).add(socketId);
};

const removeUserSocket = (userId, socketId) => {
	const normalizedUserId = String(userId);

	if (!onlineUsersMap.has(normalizedUserId)) return;

	const sockets = onlineUsersMap.get(normalizedUserId);
	sockets.delete(socketId);

	if (sockets.size === 0) {
		onlineUsersMap.delete(normalizedUserId);
	}
};

const getOnlineUserIds = () => [...onlineUsersMap.keys()];

export const getReceiverSocketId = (userId) => {
	const normalizedUserId = String(userId);
	const sockets = onlineUsersMap.get(normalizedUserId);

	if (!sockets || sockets.size === 0) return null;

	return [...sockets][0];
};

io.use((socket, next) => {
	try {
		const rawCookie = socket.handshake.headers.cookie;

		if (!rawCookie) {
			return next(new Error("Authentication error: No cookies found"));
		}

		const cookies = cookie.parse(rawCookie);
		const token = cookies.jwt;

		if (!token) {
			return next(new Error("Authentication error: No token found"));
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded?.id) {
			return next(new Error("Authentication error: Invalid token payload"));
		}

		socket.userId = String(decoded.id);

		next();
	} catch (error) {
		console.error("Socket auth error:", error.message);
		next(new Error("Authentication error"));
	}
});

io.on("connection", (socket) => {
	const userId = socket.userId;

	if (!userId) {
		socket.disconnect();
		return;
	}

	// console.log(`Socket connected: ${socket.id}, userId: ${userId}`);

	addUserSocket(userId, socket.id);
	io.emit("presence:update", getOnlineUserIds());

	socket.on("disconnect", (reason) => {
		console.log(
			`Socket disconnected: ${socket.id}, userId: ${userId}, reason: ${reason}`,
		);
		removeUserSocket(userId, socket.id);
		io.emit("presence:update", getOnlineUserIds());
	});
});

export { app, server, io };
