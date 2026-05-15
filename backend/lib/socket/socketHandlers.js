import {
	addUserSocket,
	removeUserSocket,
	getOnlineUserIds,
} from "./onlineUsers.js";
import { markPrivateMessagesAsDelivered } from "./deliveryService.js";

export const registerSocketHandlers = (io) => {
	io.on("connection", async (socket) => {
		const userId = socket.userId;

		if (!userId) {
			socket.disconnect();
			return;
		}

		addUserSocket(userId, socket.id);
		io.emit("presence:update", getOnlineUserIds());

		await markPrivateMessagesAsDelivered(io, userId);

		socket.on("presence:get", () => {
			socket.emit("presence:update", getOnlineUserIds());
		});

		socket.on("disconnect", () => {
			removeUserSocket(userId, socket.id);
			io.emit("presence:update", getOnlineUserIds());
		});
	});
};
