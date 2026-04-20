import AppError from "../lib/AppError.js";
import catchAsync from "../lib/catchAsync.js";
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

export const sendMessage = catchAsync(async (req, res) => {
	const senderId = req.user.id;
	const { conversationId } = req.params;
	const content = req.body.content?.trim() || "";
	const clientTempId = req.body.clientTempId || null;
	const replyToId = req.body.replyToId || null;

	if (!content && !req.file) {
		throw new AppError("Message content or attachment is required", 400);
	}

	let type = "text";
	let attachments = [];

	const conversation = await Conversation.findOne({
		_id: conversationId,
		participants: senderId,
	});

	if (!conversation) {
		throw new AppError("Conversation not found", 404);
	}

	// reply validation
	if (replyToId) {
		const replyMessage = await Message.findById(replyToId);

		if (
			!replyMessage ||
			replyMessage.conversationId.toString() !== conversationId
		) {
			throw new AppError("Invalid reply message", 400);
		}
	}

	// file handling
	if (req.file) {
		if (!req.file.mimetype.startsWith("image/")) {
			throw new AppError("Only image uploads are allowed", 400);
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
	}).then((doc) => doc.populate("senderId", "username avatar"));

	// update conversation
	conversation.lastMessageId = newMessage._id;
	conversation.lastMessageAt = new Date();

	const senderReadStateIndex = conversation.readState.findIndex(
		(state) => state.userId.toString() === senderId.toString(),
	);

	if (senderReadStateIndex === -1) {
		conversation.readState.push({
			userId: senderId,
			lastSeenMessageId: newMessage._id,
			lastSeenAt: newMessage.createdAt,
		});
	} else {
		const currentLastSeenAt =
			conversation.readState[senderReadStateIndex].lastSeenAt;

		if (!currentLastSeenAt || newMessage.createdAt > currentLastSeenAt) {
			conversation.readState[senderReadStateIndex].lastSeenMessageId =
				newMessage._id;
			conversation.readState[senderReadStateIndex].lastSeenAt =
				newMessage.createdAt;
		}
	}

	await conversation.save();

	if (conversation?.type === "group") {
		const allSocketIds = conversation.participants
			.filter((p) => p.toString() !== senderId.toString())
			.flatMap((participant) => getUserSocketIds(participant) || []);
		if (allSocketIds?.length) {
			allSocketIds.forEach((socketId) => {
				io.to(socketId).emit("message:new", {
					conversationId: conversation._id,
					newMessage,
				});
			});
		}
	}

	if (conversation.type === "private") {
		const senderIdStr = senderId.toString();

		const receiverId = conversation.participants
			.find((id) => id.toString() !== senderIdStr)
			.toString();

		const receiverSocketIds = getUserSocketIds(receiverId);

		if (receiverSocketIds?.length) {
			receiverSocketIds.forEach((socketId) => {
				io.to(socketId).emit("message:new", {
					conversationId: conversation._id,
					newMessage,
				});
			});

			await Message.findByIdAndUpdate(newMessage._id, {
				isDelivered: true,
				deliveredAt: new Date(),
			});

			const senderSocketIds = getUserSocketIds(senderIdStr);

			senderSocketIds?.forEach((socketId) => {
				io.to(socketId).emit("message:delivered", {
					messageId: newMessage._id,
					deliveredAt: newMessage.deliveredAt,
					conversationId: newMessage.conversationId,
				});
			});
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

	res.status(201).json({
		status: "success",
		data: {
			newMessage: {
				...populatedMessage.toObject(),
				clientTempId,
			},
		},
	});
});

export const getConversationMessages = catchAsync(async (req, res) => {
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
});

export const getAllMessages = getAll(Message);
export const getSingleMessage = getOne(Message);
export const createMessage = createOne(Message);
export const deleteMessage = deleteOne(Message);
export const updateMessage = updateOne(Message);
