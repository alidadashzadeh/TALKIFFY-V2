import { uploadBufferToCloudinary } from "../lib/cloudinaryUpload.js";
import { getUserSocketIds, io } from "../lib/socket.js";
import { buildPrivateConversationKey } from "../lib/utils.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

export const getOrCreatePrivateConversation = async (req, res, next) => {
	try {
		const currentUserId = req.user._id;
		const { userId } = req.params;

		if (currentUserId.toString() === userId.toString()) {
			return res.status(400).json({
				status: "fail",
				message: "You cannot create a conversation with yourself.",
			});
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
					{ userId: userId, lastSeenMessageId: null, lastSeenAt: null },
				],
			});

			conversation = await Conversation.findById(conversation._id).populate(
				"participants",
				"username email avatar",
			);
		}

		res.status(200).json({
			status: "success",
			data: {
				conversation,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const getMyConversations = async (req, res, next) => {
	try {
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
	} catch (err) {
		next(err);
	}
};

export const updateSeen = async (req, res) => {
	try {
		const userId = req.user._id;
		const { conversationId, lastSeenMessageId } = req.body;

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
				message: "Conversation not found",
			});
		}

		const message = await Message.findOne({
			_id: lastSeenMessageId,
			conversationId,
		}).select("_id createdAt");

		if (!message) {
			return res.status(404).json({
				status: "fail",
				message: "Message not found in this conversation",
			});
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
	} catch (error) {
		console.error("updateSeen error:", error);
		return res.status(500).json({
			status: "error",
			message: "Something went wrong",
		});
	}
};

export const createGroupConversation = async (req, res) => {
	try {
		const currentUserId = req.user._id;
		const { name, avatar } = req.body;

		if (!name || !name.trim()) {
			return res.status(400).json({
				status: "fail",
				message: "Group name is required",
			});
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

		const populatedConversation = await Conversation.findById(
			newConversation._id,
		)
			.populate("participants", "username avatar email")
			.populate("admins", "username avatar email");

		return res.status(201).json({
			status: "success",
			data: {
				conversation: populatedConversation,
			},
		});
	} catch (error) {
		console.error("createGroupConversation error:", error);
		return res.status(500).json({
			status: "fail",
			message: error.message || "Something went wrong",
		});
	}
};

export const addGroupParticipant = async (req, res) => {
	try {
		const { conversationId, userId } = req.params;
		const currentUserId = req.user._id;

		const conversation = await Conversation.findById(conversationId);

		if (!conversation) {
			return res.status(404).json({
				status: "fail",
				message: "Conversation not found",
			});
		}

		if (conversation.type !== "group") {
			return res.status(400).json({
				status: "fail",
				message: "Only group conversations can add participants",
			});
		}

		const isRequesterAdmin = conversation.admins.some(
			(admin) => String(admin) === String(currentUserId),
		);

		if (!isRequesterAdmin) {
			return res.status(403).json({
				status: "fail",
				message: "Only admins can add participants",
			});
		}

		const alreadyParticipant = conversation.participants.some(
			(p) => String(p) === String(userId),
		);

		if (alreadyParticipant) {
			return res.status(400).json({
				status: "fail",
				message: "User is already in the group",
			});
		}

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

		res.status(200).json({
			status: "success",
			data: { conversation },
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			status: "fail",
			message: error.message || "Something went wrong",
		});
	}
};

export const removeGroupParticipant = async (req, res) => {
	try {
		const { conversationId, userId } = req.params;
		const currentUserId = req.user._id;

		const conversation = await Conversation.findById(conversationId);

		if (!conversation) {
			return res.status(404).json({
				status: "fail",
				message: "Conversation not found",
			});
		}

		if (conversation.type !== "group") {
			return res.status(400).json({
				status: "fail",
				message: "Only group conversations can be updated",
			});
		}

		const isAdmin = conversation.admins.some(
			(admin) => String(admin._id || admin) === String(currentUserId),
		);

		if (!isAdmin) {
			return res.status(403).json({
				status: "fail",
				message: "Only group admins can modify participants",
			});
		}

		const isParticipant = conversation.participants.some(
			(participant) =>
				String(participant._id || participant) === String(userId),
		);

		if (!isParticipant) {
			return res.status(404).json({
				status: "fail",
				message: "User is not a member in this group",
			});
		}

		const participants = conversation.participants.filter(
			(participant) =>
				String(participant._id || participant) !== String(userId),
		);

		const readState = conversation.readState.filter(
			(state) => String(state.userId) !== String(userId),
		);

		const admins = conversation.admins.filter(
			(admin) => String(admin._id || admin) !== String(userId),
		);

		const updatedConversation = await Conversation.findByIdAndUpdate(
			conversationId,
			{ participants, admins, readState },
			{ new: true },
		)
			.populate("participants", "username email avatar")
			.populate("admins", "username email avatar");

		return res.status(200).json({
			status: "success",
			data: {
				conversation: updatedConversation,
			},
		});
	} catch (error) {
		console.error("Remove participant error:", error);
		return res.status(500).json({
			status: "fail",
			message: error.message || "Something went wrong",
		});
	}
};

export const addGroupAdmin = async (req, res) => {
	try {
		const { conversationId, userId } = req.params;
		const currentUserId = req.user._id;

		const conversation = await Conversation.findById(conversationId);

		if (!conversation) {
			return res.status(404).json({
				status: "fail",
				message: "Conversation not found",
			});
		}

		if (conversation.type !== "group") {
			return res.status(400).json({
				status: "fail",
				message: "Only group conversations can have admins",
			});
		}

		const isRequesterAdmin = conversation.admins.some(
			(admin) => String(admin._id || admin) === String(currentUserId),
		);

		if (!isRequesterAdmin) {
			return res.status(403).json({
				status: "fail",
				message: "Only admins can promote members",
			});
		}

		const isParticipant = conversation.participants.some(
			(p) => String(p._id || p) === String(userId),
		);

		if (!isParticipant) {
			return res.status(400).json({
				status: "fail",
				message: "User must be a group participant first",
			});
		}

		const alreadyAdmin = conversation.admins.some(
			(admin) => String(admin._id || admin) === String(userId),
		);

		if (alreadyAdmin) {
			return res.status(400).json({
				status: "fail",
				message: "User is already an admin",
			});
		}

		conversation.admins.push(userId);
		await conversation.save();

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
	} catch (error) {
		console.error("Add admin error:", error);

		return res.status(500).json({
			status: "fail",
			message: error.message || "Something went wrong",
		});
	}
};

export const removeGroupAdmin = async (req, res) => {
	try {
		const { conversationId, userId } = req.params;
		const currentUserId = req.user._id;

		const conversation = await Conversation.findById(conversationId);

		if (!conversation) {
			return res.status(404).json({
				status: "fail",
				message: "Conversation not found",
			});
		}

		// must be group
		if (conversation.type !== "group") {
			return res.status(400).json({
				status: "fail",
				message: "Only group conversations can have admins",
			});
		}

		// requester must be admin
		const isRequesterAdmin = conversation.admins.some(
			(admin) => String(admin._id || admin) === String(currentUserId),
		);

		if (!isRequesterAdmin) {
			return res.status(403).json({
				status: "fail",
				message: "Only admins can remove other admins",
			});
		}

		// target must be admin
		const isTargetAdmin = conversation.admins.some(
			(admin) => String(admin._id || admin) === String(userId),
		);

		if (!isTargetAdmin) {
			return res.status(400).json({
				status: "fail",
				message: "User is not an admin",
			});
		}

		// prevent removing last admin
		if (conversation.admins.length === 1) {
			return res.status(400).json({
				status: "fail",
				message: "Cannot remove the last admin",
			});
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

		return res.status(200).json({
			status: "success",
			data: {
				conversation: updatedConversation,
			},
		});
	} catch (error) {
		console.error("Remove admin error:", error);

		return res.status(500).json({
			status: "fail",
			message: error.message || "Something went wrong",
		});
	}
};

export const leaveGroup = async (req, res) => {
	try {
		const { conversationId } = req.params;
		const currentUserId = req.user._id;

		const conversation = await Conversation.findById(conversationId);

		if (!conversation) {
			return res.status(404).json({
				status: "fail",
				message: "Conversation not found",
			});
		}

		if (conversation.type !== "group") {
			return res.status(400).json({
				status: "fail",
				message: "Only group conversations can be left",
			});
		}

		const isParticipant = conversation.participants.some(
			(user) => String(user._id || user) === String(currentUserId),
		);

		if (!isParticipant) {
			return res.status(400).json({
				status: "fail",
				message: "You are not a member of this group",
			});
		}

		// remove from participants
		conversation.participants = conversation.participants.filter(
			(user) => String(user._id || user) !== String(currentUserId),
		);

		conversation.readState = conversation.readState.filter(
			(state) => String(state.userId) !== String(currentUserId),
		);

		// remove from admins if admin
		conversation.admins = conversation.admins.filter(
			(admin) => String(admin._id || admin) !== String(currentUserId),
		);

		if (conversation.participants.length === 0) {
			await Conversation.findByIdAndDelete(conversationId);

			return res.status(200).json({
				status: "success",
				message:
					"You left the group and it was deleted because it became empty",
				data: {
					conversationId,
					deleted: true,
				},
			});
		}

		// if no admins left but members exist → promote first member
		if (
			conversation.admins.length === 0 &&
			conversation.participants.length > 0
		) {
			conversation.admins.push(conversation.participants[0]);
		}

		await conversation.save();

		res.status(200).json({
			status: "success",
			message: "You left the group",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			status: "error",
			message: "Failed to leave group",
		});
	}
};

export const updateGroupAvatar = async (req, res) => {
	try {
		const { conversationId } = req.params;
		const currentUserId = req.user._id;

		if (!req.file) {
			return res.status(400).json({
				status: "fail",
				message: "Avatar image is required",
			});
		}

		const conversation = await Conversation.findById(conversationId);

		if (!conversation) {
			return res.status(404).json({
				status: "fail",
				message: "Conversation not found",
			});
		}

		if (conversation.type !== "group") {
			return res.status(400).json({
				status: "fail",
				message: "Only group conversations can update avatar",
			});
		}

		const isAdmin = conversation.admins.some(
			(admin) => String(admin._id || admin) === String(currentUserId),
		);

		if (!isAdmin) {
			return res.status(403).json({
				status: "fail",
				message: "Only group admins can update avatar",
			});
		}

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
	} catch (error) {
		console.error("updateGroupAvatar error:", error);

		res.status(500).json({
			status: "error",
			message: "Failed to update group avatar",
		});
	}
};
