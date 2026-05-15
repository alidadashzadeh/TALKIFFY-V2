import AppError from "../lib/AppError.js";
import catchAsync from "../lib/catchAsync.js";
import { uploadBufferToCloudinary } from "../lib/cloudinaryUpload.js";
import { io } from "../lib/socket/index.js";
import { getUserSocketIds } from "../lib/socket/onlineUsers.js";
import { emitToConversationParticipants } from "../lib/socket/socketNotifications.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { ensureConversationExists, ensureParticipant } from "../lib/utils.js";

export const sendMessage = catchAsync(async (req, res) => {
	const senderId = req.user._id;
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

	ensureConversationExists(conversation);

	if (replyToId) {
		const replyMessage = await Message.findById(replyToId);

		if (
			!replyMessage ||
			replyMessage.conversationId.toString() !== conversationId
		) {
			throw new AppError("Invalid reply message", 400);
		}
	}

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

	const populatedMessage = await Message.findById(newMessage._id)
		.populate("senderId", "username avatar")
		.populate({
			path: "replyTo",
			populate: {
				path: "senderId",
				select: "username avatar",
			},
		})
		.populate({
			path: "reactions",
			populate: {
				path: "userId",
				select: "username avatar",
			},
		});

	if (conversation?.type === "group") {
		emitToConversationParticipants({
			io,
			conversation,
			event: "message:new",
			payload: {
				conversationId: conversation._id,
				newMessage: populatedMessage,
				clientTempId,
			},
		});
	}

	if (conversation.type === "private") {
		const senderIdStr = senderId.toString();

		const receiverId = conversation.participants
			.find((id) => id.toString() !== senderIdStr)
			.toString();

		const receiverSocketIds = getUserSocketIds(receiverId) || [];

		let deliveredAt = null;

		if (receiverSocketIds.length) {
			deliveredAt = new Date();

			await Message.findByIdAndUpdate(newMessage._id, {
				isDelivered: true,
				deliveredAt,
			});

			populatedMessage.isDelivered = true;
			populatedMessage.deliveredAt = deliveredAt;
		}

		emitToConversationParticipants({
			io,
			conversation,
			event: "message:new",
			payload: {
				conversationId: conversation._id,
				newMessage: populatedMessage,
				clientTempId,
			},
		});

		if (deliveredAt) {
			const senderSocketIds = getUserSocketIds(senderIdStr) || [];

			senderSocketIds.forEach((socketId) => {
				io.to(socketId).emit("message:delivered", {
					messageId: newMessage._id,
					deliveredAt,
					conversationId: newMessage.conversationId,
				});
			});
		}
	}
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
		.populate({
			path: "reactions",
			populate: {
				path: "userId",
				select: "username avatar",
			},
		})
		.sort({ createdAt: 1 });

	res.status(200).json({
		status: "success",
		data: { messages },
	});
});

export const reactToMessage = catchAsync(async (req, res, next) => {
	const { messageId } = req.params;
	const { emoji } = req.body;
	const currentUserId = req.user._id;

	if (!emoji || typeof emoji !== "string" || !emoji.trim()) {
		return next(new AppError("Emoji is required", 400));
	}

	const message = await Message.findById(messageId);

	if (!message) {
		return next(new AppError("Message not found", 404));
	}

	const conversation = await Conversation.findById(message.conversationId);

	ensureConversationExists(conversation);
	ensureParticipant(conversation, currentUserId);

	const cleanEmoji = emoji.trim();

	const existingReactionIndex = message.reactions.findIndex(
		(reaction) => String(reaction.userId) === String(currentUserId),
	);

	if (existingReactionIndex === -1) {
		message.reactions.push({
			userId: currentUserId,
			emoji: cleanEmoji,
		});
	} else {
		const existingReaction = message.reactions[existingReactionIndex];

		if (existingReaction.emoji === cleanEmoji) {
			message.reactions.splice(existingReactionIndex, 1);
		} else {
			message.reactions[existingReactionIndex].emoji = cleanEmoji;
		}
	}

	await message.save();

	const updatedMessage = await Message.findById(message._id)
		.populate({
			path: "senderId",
			select: "username avatar",
		})
		.populate({
			path: "replyTo",
			populate: {
				path: "senderId",
				select: "username avatar",
			},
		})
		.populate({
			path: "reactions.userId",
			select: "username avatar",
		});

	const socketIds = conversation.participants.flatMap(
		(participantId) => getUserSocketIds(participantId.toString()) || [],
	);

	socketIds.forEach((socketId) => {
		io.to(socketId).emit("message:reactionUpdated", {
			conversationId: conversation._id,
			message: updatedMessage,
		});
	});

	res.status(200).json({
		status: "success",
		data: {
			message: updatedMessage,
		},
	});
});
