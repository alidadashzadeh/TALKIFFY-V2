import { uploadBufferToCloudinary } from "../lib/cloudinaryUpload.js";
import { getUserSocketIds, io } from "../lib/socket.js";
import Conversation from "../models/conversationModel.js";
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
		const content = req.body.content?.trim() || "";
		const clientTempId = req.body.clientTempId || null;
		const replyToId = req.body.replyToId || null;

		if (!content && !req.file) {
			return res.status(400).json({
				status: "fail",
				message: "Message content or attachment is required",
			});
		}

		let type = "text";
		let attachments = [];

		const conversation = await Conversation.findOne({
			_id: conversationId,
			participants: senderId,
		});

		if (!conversation) {
			return res.status(404).json({
				status: "fail",
				message: "Conversation not found or access denied",
			});
		}

		if (replyToId) {
			const replyMessage = await Message.findById(replyToId);

			if (
				!replyMessage ||
				replyMessage.conversationId.toString() !== conversationId
			) {
				return res.status(400).json({
					status: "fail",
					message: "Invalid reply message",
				});
			}
		}

		if (req.file) {
			if (!req.file.mimetype.startsWith("image/")) {
				return res.status(400).json({
					status: "fail",
					message: "Only image uploads are allowed",
				});
			}

			const uploadedFile = await uploadBufferToCloudinary(
				req.file.buffer,
				"talkiffy/messages",
			);

			type = "image";

			attachments = [
				{
					type: "image",
					url: uploadedFile.secure_url,
					publicId: uploadedFile.public_id,
					fileName: req.file.originalname,
					mimeType: req.file.mimetype,
					size: req.file.size,
				},
			];
		}

		const newMessage = await Message.create({
			senderId,
			conversationId,
			type,
			content,
			attachments,
			replyTo: replyToId,
		});

		conversation.lastMessageId = newMessage._id;
		conversation.lastMessageAt = new Date();
		await conversation.save();

		if (conversation?.type === "group") {
			const allSocketIds = conversation.participants
				.filter((p) => p.toString() !== senderId.toString())
				.flatMap((participant) => getUserSocketIds(participant) || []);

			if (allSocketIds?.length) {
				allSocketIds.forEach((socketId) => {
					io.to(socketId).emit("message:new", {
						conversationId: conversation._id,
					});
				});
			}
		}
		if (conversation?.type === "private") {
			const senderIdStr = senderId.toString();
			const receiverId = conversation.participants
				.find((id) => id.toString() !== senderIdStr)
				.toString();
			const receiverSocketIds = getUserSocketIds(receiverId);

			if (receiverSocketIds?.length) {
				receiverSocketIds.forEach((socketId) => {
					io.to(socketId).emit("message:new", {
						conversationId: conversation._id,
					});
				});

				await Message.findByIdAndUpdate(newMessage._id, {
					isDelivered: true,
					deliveredAt: new Date(),
				});

				const senderSocketIds = getUserSocketIds(senderIdStr);
				if (senderSocketIds?.length) {
					senderSocketIds.forEach((socketId) => {
						io.to(socketId).emit("message:delivered", {
							conversationId: conversation._id,
							messageId: newMessage._id,
							userId: receiverId,
						});
					});
				}
			}
		}

		const populatedMessage = await Message.findById(newMessage._id)
			.populate("senderId", "username avatar")
			.populate({
				path: "replyTo",
				populate: {
					path: "senderId",
					select: "username avatar",
				},
			});

		return res.status(201).json({
			status: "success",
			data: {
				newMessage: {
					...populatedMessage.toObject(),
					clientTempId,
				},
			},
		});
	} catch (error) {
		return res.status(500).json({
			status: "fail",
			message: error.message || "Message send went wrong",
		});
	}
};

export const getConversationMessages = async (req, res, next) => {
	const { conversationId } = req.params;

	const messages = await Message.find({ conversationId })
		.populate("senderId", "username avatar")
		.populate({
			path: "replyTo",
			populate: {
				path: "senderId",
				select: "username avatar",
			},
		})
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
					.to(getUserSocketIds(message?.senderId))
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
	const userId = req.user.id;
	const { conversationId, lastSeenMessageId } = req.body;

	try {
		if (!conversationId || !lastSeenMessageId) {
			return res.status(400).json({
				status: "fail",
				message: "conversationId and lastSeenMessageId are required",
			});
		}

		const conversation = await Conversation.findOne({
			_id: conversationId,
			participants: userId,
		});

		if (!conversation) {
			return res.status(404).json({
				status: "fail",
				message: "Conversation not found or access denied",
			});
		}

		const targetMessage = await Message.findOne({
			_id: lastSeenMessageId,
			conversationId,
		});

		if (!targetMessage) {
			return res.status(404).json({
				status: "fail",
				message: "Target message not found",
			});
		}

		const now = new Date();

		const updateResult = await Message.updateMany(
			{
				conversationId,
				senderId: { $ne: userId },
				isSeen: false,
				createdAt: { $lte: targetMessage.createdAt },
			},
			{
				$set: {
					isSeen: true,
					seenAt: now,
				},
			},
		);

		if (updateResult.modifiedCount > 0) {
			const payload = {
				conversationId,
				lastSeenMessageId,
				seenBy: userId,
				seenAt: now,
			};

			const socketIds = conversation.participants
				.filter((p) => p.toString() !== userId.toString())
				.flatMap((participant) => getUserSocketIds(participant) || []);

			socketIds.forEach((socketId) => {
				io.to(socketId).emit("message:seen", payload);
			});
		}

		return res.status(200).json({
			status: "success",
			data: {
				updatedMessages: updateResult,
			},
		});
	} catch (error) {
		console.error("error in updateSeenMessages:", error);

		return res.status(400).json({
			status: "fail",
			message: error.message || "error in update seen messages",
		});
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
