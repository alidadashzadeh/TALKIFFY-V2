import express from "express";

import {
	getAllMessages,
	sendMessage,
	createMessage,
	getSingleMessage,
	updateMessage,
	deleteMessage,
	getMessages,
	updateDeliverMessages,
	updateSeenMessages,
	checkUnseenMessagesOnLogin,
} from "../controllers/messageController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.route("/:id").post(protect, sendMessage);

router.route("/update-delivered").patch(protect, updateDeliverMessages);

router.route("/update-seen").patch(protect, updateSeenMessages);

router.route("/check-unseen-messages").get(protect, checkUnseenMessagesOnLogin);

router.route("/getMessages/:id").get(protect, getMessages);

router.route("/").get(getAllMessages).post(createMessage);
router.route("/api/messages/:conversationId").get(getAllMessages);

router
	.route("/:id")
	.get(getSingleMessage)
	.patch(updateMessage)
	.delete(deleteMessage);

export default router;
