import { uploadBufferToCloudinary } from "../lib/cloudinaryUpload.js";
import { getUserSocketIds, io } from "../lib/socket.js";
import {
	alreadyParticipant,
	buildPrivateConversationKey,
	ensureAdmin,
	ensureConversationExists,
	ensureGroupConversation,
	ensureParticipant,
} from "../lib/utils.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import catchAsync from "../lib/catchAsync.js";
import AppError from "../lib/AppError.js";
import {
	emitToConversationParticipants,
	emitToUsers,
} from "../lib/utils/socketNotifications.js";

export const getOrCreatePrivateConversation = catchAsync(async (req, res) => {
	const currentUserId = req.user._id;
	const { userId } = req.params;

	if (currentUserId.toString() === userId.toString()) {
		throw new AppError("You cannot create a conversation with yourself.", 400);
	}

	const conversationKey = buildPrivateConversationKey(currentUserId, userId);

	let conversation = await Conversation.findOne({
		conversationKey,
		type: "private",
	}).populate("participants", "username email avatar");

	if (!conversation) {
		conversation = await Conversation.create({
			type: "private",
			conversationKey,
			participants: [currentUserId, userId],
			readState: [
				{ userId: currentUserId, lastSeenMessageId: null, lastSeenAt: null },
				{ userId, lastSeenMessageId: null, lastSeenAt: null },
			],
		});

		await conversation.populate("participants", "username email avatar");
	}

	res.status(200).json({
		status: "success",
		data: {
			conversation,
		},
	});
});

export const getMyConversations = catchAsync(async (req, res, next) => {
	const currentUserId = req.user._id;

	const conversations = await Conversation.find({
		participants: currentUserId,
	})
		.populate("participants", "username avatar email")
		.populate({
			path: "lastMessageId",
			select: "content attachments senderId",
			populate: {
				path: "senderId",
				select: "username",
			},
		})
		.sort({ lastMessageAt: -1 })
		.lean();

	const conversationsWithUnreadCounts = await Promise.all(
		conversations.map(async (conversation) => {
			const myReadState = conversation.readState?.find(
				(state) => state.userId.toString() === currentUserId.toString(),
			);

			const unreadQuery = {
				conversationId: conversation._id,
				senderId: { $ne: currentUserId },
			};

			if (myReadState?.lastSeenAt) {
				unreadQuery.createdAt = { $gt: myReadState.lastSeenAt };
			}

			const unreadCount = await Message.countDocuments(unreadQuery);

			return {
				...conversation,
				unreadCount,
			};
		}),
	);

	res.status(200).json({
		status: "success",
		data: {
			conversations: conversationsWithUnreadCounts,
		},
	});
});

export const updateSeen = catchAsync(async (req, res, next) => {
	const userId = req.user._id;
	const { conversationId, lastSeenMessageId } = req.body;

	if (!conversationId || !lastSeenMessageId) {
		throw new AppError(
			"conversationId and lastSeenMessageId are required",
			400,
		);
	}

	const conversation = await Conversation.findOne({
		_id: conversationId,
		participants: userId,
	});

	const message = await Message.findOne({
		_id: lastSeenMessageId,
		conversationId,
	}).select("_id createdAt");

	if (!conversation) {
		throw new AppError("Conversation not found", 404);
	}
	if (!message) {
		throw new AppError("Message not found in this conversation", 404);
	}

	const readStateIndex = conversation.readState.findIndex(
		(r) => String(r.userId) === String(userId),
	);

	if (readStateIndex !== -1) {
		conversation.readState[readStateIndex].lastSeenMessageId = message._id;
		conversation.readState[readStateIndex].lastSeenAt = message.createdAt;
	} else {
		conversation.readState.push({
			userId,
			lastSeenMessageId: message._id,
			lastSeenAt: message.createdAt,
		});
	}

	await conversation.save();

	const payload = {
		conversationId: String(conversation._id),
		userId: String(userId),
		lastSeenMessageId: String(message._id),
		lastSeenAt: message.createdAt,
	};

	const otherParticipantIds = conversation.participants.filter(
		(participantId) => String(participantId) !== String(userId),
	);

	otherParticipantIds.forEach((participantId) => {
		const socketIds = getUserSocketIds(String(participantId));

		socketIds.forEach((socketId) => {
			io.to(socketId).emit("message:seen", payload);
		});
	});

	return res.status(200).json({
		status: "success",
		message: "Messages marked as seen",
		data: payload,
	});
});

export const createGroupConversation = catchAsync(async (req, res) => {
	const currentUserId = req.user._id;
	const { name, avatar } = req.body;

	if (!name || !name.trim()) {
		throw new AppError("Group name is required", 400);
	}

	const newConversation = await Conversation.create({
		type: "group",
		name: name.trim(),
		avatar: avatar || "",
		participants: [currentUserId],
		readState: [
			{ userId: currentUserId, lastSeenMessageId: null, lastSeenAt: null },
		],
		admins: [currentUserId],
		lastMessageId: null,
		lastMessageAt: new Date(),
	});

	await newConversation.populate([
		{ path: "participants", select: "username avatar email" },
	]);

	return res.status(201).json({
		status: "success",
		data: {
			conversation: newConversation,
		},
	});
});

export const addGroupParticipant = catchAsync(async (req, res) => {
	const { conversationId, userId } = req.params;
	const currentUserId = req.user._id;

	const conversation = await Conversation.findById(conversationId);

	ensureConversationExists(conversation);
	ensureGroupConversation(conversation);
	ensureAdmin(conversation, currentUserId);
	alreadyParticipant(conversation, userId);

	conversation.participants.push(userId);
	conversation.readState.push({
		userId,
		lastSeenMessageId: conversation.lastMessageId || null,
		lastSeenAt: conversation.lastMessageAt || new Date(),
	});

	await conversation.save();

	await conversation.populate([
		{ path: "participants", select: "username email avatar" },
		{ path: "admins", select: "username avatar" },
	]);
	const addedParticipant = conversation.participants.find(
		(p) => String(p._id) === String(userId),
	);
	emitToConversationParticipants({
		io,
		conversation,
		event: "group:memberAdded",
		payload: {
			conversationId,
			participant: addedParticipant,
			readStateEntry: {
				userId: String(userId),
				lastSeenMessageId: conversation.lastMessageId
					? conversation.lastMessageId
					: null,
				lastSeenAt: conversation.lastMessageAt || new Date(),
			},
		},
	});

	res.status(200).json({
		status: "success",
		data: { conversation },
	});
});

export const removeGroupParticipant = catchAsync(async (req, res) => {
	const { conversationId, userId } = req.params;
	const currentUserId = req.user._id;

	const conversation = await Conversation.findById(conversationId);

	ensureConversationExists(conversation);
	ensureGroupConversation(conversation);
	ensureAdmin(conversation, currentUserId);
	ensureParticipant(conversation, userId);

	const participants = conversation.participants.filter(
		(p) => String(p._id || p) !== String(userId),
	);

	const readState = conversation.readState.filter(
		(state) => String(state.userId) !== String(userId),
	);

	const admins = conversation.admins.filter(
		(a) => String(a._id || a) !== String(userId),
	);

	const updatedConversation = await Conversation.findByIdAndUpdate(
		conversationId,
		{ participants, admins, readState },
		{ new: true },
	)
		.populate("participants", "username email avatar")
		.populate("admins", "username email avatar");

	emitToConversationParticipants({
		io,
		conversation,
		event: "group:memberRemoved",
		payload: { conversationId, userId },
	});

	return res.status(200).json({
		status: "success",
		data: {
			conversation: updatedConversation,
		},
	});
});

export const addGroupAdmin = catchAsync(async (req, res) => {
	const { conversationId, userId } = req.params;
	const currentUserId = req.user._id;

	const conversation = await Conversation.findById(conversationId);

	ensureConversationExists(conversation);
	ensureGroupConversation(conversation);
	ensureAdmin(conversation, currentUserId);
	ensureParticipant(conversation, userId);

	const alreadyAdmin = conversation.admins.some(
		(admin) => String(admin._id || admin) === String(userId),
	);

	if (alreadyAdmin) {
		throw new AppError("User is already an admin", 400);
	}

	conversation.admins.push(userId);
	await conversation.save();

	emitToConversationParticipants({
		io,
		conversation,
		event: "group:adminAdded",
		payload: { conversationId, userId },
	});

	await conversation.populate([
		{ path: "participants", select: "username email avatar" },
		{ path: "admins", select: "username avatar" },
	]);

	return res.status(200).json({
		status: "success",
		data: {
			conversation,
		},
	});
});

export const removeGroupAdmin = catchAsync(async (req, res) => {
	const { conversationId, userId } = req.params;
	const currentUserId = req.user._id;

	const conversation = await Conversation.findById(conversationId);

	ensureConversationExists(conversation);
	ensureGroupConversation(conversation);
	ensureAdmin(conversation, currentUserId);

	const isTargetAdmin = conversation.admins.some(
		(admin) => String(admin._id || admin) === String(userId),
	);

	if (!isTargetAdmin) {
		throw new AppError("User is not an admin", 400);
	}

	if (conversation.admins.length === 1) {
		throw new AppError("Cannot remove the last admin", 400);
	}

	const updatedConversation = await Conversation.findByIdAndUpdate(
		conversationId,
		{
			$pull: { admins: userId },
		},
		{ new: true },
	)
		.populate("participants", "username email avatar")
		.populate("admins", "username email avatar");

	emitToConversationParticipants({
		io,
		conversation,
		event: "group:adminRemoved",
		payload: { conversationId, userId },
	});

	return res.status(200).json({
		status: "success",
		data: {
			conversation: updatedConversation,
		},
	});
});

export const leaveGroup = catchAsync(async (req, res) => {
	const { conversationId } = req.params;
	const currentUserId = req.user._id;

	const conversation = await Conversation.findById(conversationId);

	ensureConversationExists(conversation);
	ensureGroupConversation(conversation);

	const isParticipant = conversation.participants.some(
		(user) => String(user._id || user) === String(currentUserId),
	);

	if (!isParticipant) {
		throw new AppError("You are not a member of this group", 400);
	}

	conversation.participants = conversation.participants.filter(
		(user) => String(user._id || user) !== String(currentUserId),
	);

	conversation.readState = conversation.readState.filter(
		(state) => String(state.userId) !== String(currentUserId),
	);

	conversation.admins = conversation.admins.filter(
		(admin) => String(admin._id || admin) !== String(currentUserId),
	);

	if (conversation.participants.length === 0) {
		await Conversation.findByIdAndDelete(conversationId);

		return res.status(200).json({
			status: "success",
			message: "You left the group and it was deleted because it became empty",
			data: {
				conversationId,
				deleted: true,
			},
		});
	}

	if (
		conversation.admins.length === 0 &&
		conversation.participants.length > 0
	) {
		conversation.admins.push(conversation.participants[0]);
	}

	await conversation.save();

	emitToConversationParticipants({
		io,
		conversation,
		event: "group:memberLeft",
	});

	res.status(200).json({
		status: "success",
		message: "You left the group",
	});
});

export const updateGroupAvatar = catchAsync(async (req, res) => {
	const { conversationId } = req.params;
	const currentUserId = req.user._id;

	if (!req.file) {
		throw new AppError("Avatar image is required", 400);
	}

	const conversation = await Conversation.findById(conversationId);

	ensureConversationExists(conversation);
	ensureGroupConversation(conversation);
	ensureAdmin(conversation, currentUserId);

	const uploaded = await uploadBufferToCloudinary(
		req.file.buffer,
		"talkiffy/groups",
	);

	conversation.avatar = uploaded.secure_url;

	await conversation.save();

	const updatedConversation = await Conversation.findById(conversationId)
		.populate("participants", "username email avatar")
		.populate("admins", "username email avatar");

	res.status(200).json({
		status: "success",
		data: {
			conversation: updatedConversation,
		},
	});
});

export const updateGroupName = catchAsync(async (req, res) => {
	const { conversationId } = req.params;
	const { name } = req.body;

	if (!name || !name.trim()) {
		return res.status(400).json({
			message: "Group name is required",
		});
	}

	const conversation = await Conversation.findById(conversationId);

	if (!conversation) {
		return res.status(404).json({
			message: "Conversation not found",
		});
	}

	if (!conversation.type === "group") {
		return res.status(400).json({
			message: "This conversation is not a group",
		});
	}

	const isAdmin = conversation.admins.some(
		(userId) => userId.toString() === req.user._id.toString(),
	);

	if (!isAdmin) {
		return res.status(403).json({
			message: "You are not allowed to update this group",
		});
	}

	conversation.name = name.trim();

	await conversation.save();

	const updatedConversation = await Conversation.findById(conversationId)
		.populate("participants", "username email avatar")
		.populate("admins", "username email avatar");

	res.status(200).json({
		message: "Group name updated successfully",
		status: "success",
		data: {
			conversation: updatedConversation,
		},
	});
});
