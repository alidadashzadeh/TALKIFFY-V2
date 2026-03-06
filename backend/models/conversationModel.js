import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["private", "group"],
			default: "private",
			required: true,
		},

		conversationKey: {
			type: String,
			unique: true,
			sparse: true,
		},

		name: {
			type: String,
			trim: true,
			default: "",
		},

		avatar: {
			type: String,
			default: "",
		},

		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],

		admins: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],

		lastMessageId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
			default: null,
		},

		lastMessageAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index(
	{ conversationKey: 1 },
	{ unique: true, sparse: true },
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
