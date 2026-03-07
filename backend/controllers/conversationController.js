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
		const userId = req.user._id;

		const conversations = await Conversation.find({
			participants: userId,
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
				success: false,
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
			.populate("participants", "_id fullName username profilePic")
			.populate("admins", "_id fullName username profilePic");

		return res.status(201).json({
			success: true,
			message: "Group created successfully",
			conversation: populatedConversation,
		});
	} catch (error) {
		console.error("createGroupConversation error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
