import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/messageModel.js";
import {
	createOne,
	deleteOne,
	getAll,
	getOne,
	updateOne,
} from "./handleFactory.js";

export const sendMessage = async (req, res) => {
	try {
		const senderId = req.user.id;
		const { conversationId } = req.params;

		const newMessage = await Message.create({
			senderId,
			conversationId,
			content: req.body.content,
		});

		const populatedMessage = await Message.findById(newMessage._id).populate(
			"senderId",
			"username avatar",
		);

		res.status(201).json({ status: "success", data: { newMessage } });
	} catch (error) {
		res.status(400).json({
			status: "fail",
			message: error.message || "Message send went wrong",
		});
	}
};

export const getConversationMessages = async (req, res, next) => {
	const { conversationId } = req.params;

	const messages = await Message.find({ conversationId })
		.populate("senderId", "username avatar")
		.sort({ createdAt: 1 });

	res.status(200).json({
		status: "success",
		data: { messages },
	});
};

export const updateDeliverMessages = async (req, res) => {
	const { receiverId } = req.body;

	try {
		const messages = await Message.find({
			receiverId: receiverId,
			isDelivered: false,
		});

		if (messages.length > 0) {
			const results = await Message.updateMany(
				{ receiverId: receiverId, isDelivered: false },
				{ $set: { isDelivered: true } },
			);

			messages.forEach((message) =>
				io
					.to(getReceiverSocketId(message?.senderId))
					.emit("getDeliveredOnLogin", message),
			);
		}

		res.status(200).json({
			status: "success",
		});
	} catch (error) {
		res
			.status(400)
			.json({ status: "fail", message: "error in update deliver messages" });
	}
};

export const updateSeenMessages = async (req, res) => {
	const { senderId } = req.body;
	const { id: receiverId } = req.user;

	try {
		const messages = await Message.find({
			receiverId,
			senderId,
			isSeen: false,
		});

		if (messages.length > 0) {
			const results = await Message.updateMany(
				{ receiverId, senderId, isSeen: false },
				{ $set: { isSeen: true, isDelivered: true } },
			);

			messages.forEach((message) =>
				io.to(getReceiverSocketId(message?.senderId)).emit("getSeen", message),
			);
		}

		res.status(200).json({
			status: "success",
		});
	} catch (error) {
		res
			.status(400)
			.json({ status: "fail", message: "error in update seen messages" });
	}
};

export const checkUnseenMessagesOnLogin = async (req, res) => {
	const { id: receiverId } = req.user;

	try {
		const messages = await Message.find({
			receiverId,
			isSeen: false,
		});

		res.status(200).json({
			status: "success",
			data: { messages },
		});
	} catch (error) {
		res
			.status(400)
			.json({ status: "fail", message: "error in getting Unseen messages" });
	}
};

export const getAllMessages = getAll(Message);
export const getSingleMessage = getOne(Message);
export const createMessage = createOne(Message);
export const deleteMessage = deleteOne(Message);
export const updateMessage = updateOne(Message);
