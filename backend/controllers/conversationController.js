import { buildPrivateConversationKey } from "../lib/utils.js";
import Conversation from "../models/conversationModel.js";

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
			.populate("lastMessageId")
			.sort({ lastMessageAt: -1 });

		res.status(200).json({
			status: "success",
			results: conversations.length,
			data: {
				conversations,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const createGroupConversation = async (req, res) => {
	try {
		const currentUserId = req.user._id; // assuming auth middleware sets req.user
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

export const addGroupParticipants = async (req, res) => {
	try {
		const { conversationId } = req.params;
		let { participants } = req.body;

		if (!Array.isArray(participants)) {
			return res.status(400).json({
				status: "fail",
				message: "Participants must be an array",
			});
		}

		const conversation = await Conversation.findById(conversationId);

		if (!conversation) {
			return res
				.status(404)
				.json({ status: "fail", message: "Conversation not found" });
		}

		// ensure it is a group
		if (conversation.type !== "group") {
			return res.status(400).json({
				status: "fail",
				message: "Only group conversations can be updated",
			});
		}

		// ✅ check if current user is one of the admins
		const isAdmin = conversation.admins.some(
			(admin) => String(admin._id || admin) === String(req.user._id),
		);

		if (!isAdmin) {
			return res.status(403).json({
				status: "fail",
				message: "Only group admins can modify participants",
			});
		}

		// remove duplicates
		participants = [...new Set(participants)];

		const updatedConversation = await Conversation.findByIdAndUpdate(
			conversationId,
			{ participants },
			{ new: true },
		)
			.populate("participants", "username email avatar")
			.populate("admins", "username avatar");

		res.status(200).json({
			status: "success",
			data: {
				conversation: updatedConversation,
			},
		});
	} catch (error) {
		console.error("Update participants error:", error);
		res.status(500).json({
			status: "fail",
			message: error.message || "Something went wrong",
		});
	}
};

export const removeGroupParticipant = async (req, res) => {
	try {
		const { conversationId, userId } = req.params;

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
			(admin) => String(admin._id || admin) === String(req.user._id),
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

		const updatedConversation = await Conversation.findByIdAndUpdate(
			conversationId,
			{ participants },
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
