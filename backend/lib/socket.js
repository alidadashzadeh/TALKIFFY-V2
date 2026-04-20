import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";

import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

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

export const getUserSocketIds = (userId) => {
	const normalizedUserId = String(userId);
	const sockets = onlineUsersMap.get(normalizedUserId);

	if (!sockets || sockets.size === 0) return [];

	return [...sockets];
};

const markPrivateMessagesAsDelivered = async (userId) => {
	try {
		const privateConversations = await Conversation.find({
			type: "private",
			participants: userId,
		}).select("_id");

		const conversationIds = privateConversations.map(
			(conversation) => conversation._id,
		);

		if (conversationIds.length === 0) return;

		const undeliveredMessages = await Message.find({
			conversationId: { $in: conversationIds },
			senderId: { $ne: userId },
			isDelivered: false,
		}).select("_id senderId conversationId");

		if (undeliveredMessages.length === 0) return;

		const messageIds = undeliveredMessages.map((message) => message._id);

		await Message.updateMany(
			{ _id: { $in: messageIds } },
			{ $set: { isDelivered: true } },
		);

		for (const message of undeliveredMessages) {
			const senderSocketIds = getUserSocketIds(message.senderId);

			for (const socketId of senderSocketIds) {
				io.to(socketId).emit("message:delivered", {
					messageId: message._id,
					deliveredAt: message.deliveredAt,
					conversationId: message.conversationId,
				});
			}
		}
	} catch (error) {
		console.error("Error marking private messages as delivered:", error);
	}
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

io.on("connection", async (socket) => {
	const userId = socket.userId;

	if (!userId) {
		socket.disconnect();
		return;
	}

	addUserSocket(userId, socket.id);
	io.emit("presence:update", getOnlineUserIds());

	// mark any undelivered messages as delivered for this user on login
	await markPrivateMessagesAsDelivered(userId);

	socket.on("presence:get", () => {
		socket.emit("presence:update", getOnlineUserIds());
	});

	socket.on("disconnect", () => {
		removeUserSocket(userId, socket.id);
		io.emit("presence:update", getOnlineUserIds());
	});
});

export { app, server, io };
