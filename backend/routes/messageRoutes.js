import express from "express";

import {
	getAllMessages,
	sendMessage,
	createMessage,
	getSingleMessage,
	updateMessage,
	deleteMessage,
	updateDeliverMessages,
	updateSeenMessages,
	checkUnseenMessagesOnLogin,
	getConversationMessages,
} from "../controllers/messageController.js";
import { protect } from "../controllers/authController.js";
import upload from "../lib/middleware/upload.js";
import { optimizeMessageImage } from "../lib/middleware/optimizeMessageImage.js";

const router = express.Router();
router.route("/update-delivered").patch(protect, updateDeliverMessages);
router.route("/update-seen").patch(protect, updateSeenMessages);
router.route("/check-unseen-messages").get(protect, checkUnseenMessagesOnLogin);
router.route("/").get(getAllMessages).post(createMessage);
router.route("/api/messages/:conversationId").get(getAllMessages);
router
	.route("/:id")
	.get(getSingleMessage)
	.patch(updateMessage)
	.delete(deleteMessage);

// ✅ NEW
router
	.route("/conversation/:conversationId")
	.get(protect, getConversationMessages)
	.post(protect, upload.single("file"), optimizeMessageImage, sendMessage);

export default router;
