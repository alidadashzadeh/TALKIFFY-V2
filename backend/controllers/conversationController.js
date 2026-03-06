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
