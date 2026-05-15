import Conversation from "../../models/conversationModel.js";
import Message from "../../models/messageModel.js";
import { getUserSocketIds } from "./onlineUsers.js";

export const markPrivateMessagesAsDelivered = async (io, userId) => {
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
		const deliveredAt = new Date();

		await Message.updateMany(
			{ _id: { $in: messageIds } },
			{
				$set: {
					isDelivered: true,
					deliveredAt,
				},
			},
		);

		for (const message of undeliveredMessages) {
			const senderSocketIds = getUserSocketIds(message.senderId);

			for (const socketId of senderSocketIds) {
				io.to(socketId).emit("message:delivered", {
					messageId: message._id,
					deliveredAt,
					conversationId: message.conversationId,
				});
			}
		}
	} catch (error) {
		console.error("Error marking private messages as delivered:", error);
	}
};
