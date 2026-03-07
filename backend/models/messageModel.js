import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["image", "video", "audio", "file"],
			required: true,
		},
		url: { type: String, required: true },
		publicId: { type: String }, // cloudinary or storage id
		fileName: { type: String },
		mimeType: { type: String },
		size: { type: Number }, // bytes
		duration: { type: Number }, // useful for audio/video
		thumbnailUrl: { type: String },
	},
	{ _id: false },
);

const reactionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		emoji: {
			type: String,
			required: true,
		},
	},
	{ _id: false },
);

const messageSchema = new mongoose.Schema(
	{
		conversationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
			index: true,
		},

		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},

		type: {
			type: String,
			enum: ["text", "image", "video", "audio", "file", "system"],
			default: "text",
		},

		content: {
			type: String,
			trim: true,
			default: "",
		},

		attachments: [attachmentSchema],

		replyTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
			default: null,
		},

		reactions: [reactionSchema],

		readBy: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				readAt: {
					type: Date,
					default: Date.now,
				},
			},
		],

		deliveredTo: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				deliveredAt: {
					type: Date,
					default: Date.now,
				},
			},
		],

		isEdited: {
			type: Boolean,
			default: false,
		},

		editedAt: Date,

		isDeleted: {
			type: Boolean,
			default: false,
		},

		deletedAt: Date,
	},
	{ timestamps: true },
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
