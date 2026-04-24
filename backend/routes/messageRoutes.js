import express from "express";

import {
	getAllMessages,
	sendMessage,
	createMessage,
	getSingleMessage,
	updateMessage,
	deleteMessage,
	getConversationMessages,
	reactToMessage,
} from "../controllers/messageController.js";
import { protect } from "../controllers/authController.js";
import upload from "../lib/middleware/upload.js";
import { optimizeMessageImage } from "../lib/middleware/OptimizeImage.js";

const router = express.Router();

router
	.route("/conversation/:conversationId")
	.get(protect, getConversationMessages)
	.post(protect, upload.single("file"), optimizeMessageImage, sendMessage);

router.route("/").get(getAllMessages).post(createMessage);
router.patch("/:messageId/reaction", protect, reactToMessage);
router
	.route("/:id")
	.get(getSingleMessage)
	.patch(updateMessage)
	.delete(deleteMessage);

export default router;
