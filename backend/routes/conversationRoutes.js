import express from "express";

import {
	addGroupAdmin,
	addGroupParticipant,
	createGroupConversation,
	getMyConversations,
	getOrCreatePrivateConversation,
	leaveGroup,
	removeGroupAdmin,
	removeGroupParticipant,
	updateGroupAvatar,
	updateGroupName,
	updateSeen,
} from "../controllers/conversationController.js";

import {
	getConversationMessages,
	sendMessage,
} from "../controllers/messageController.js";

import { protect } from "../controllers/authController.js";
import upload from "../lib/middleware/upload.js";

import {
	optimizeGroupAvatar,
	optimizeMessageImage,
} from "../lib/middleware/OptimizeImage.js";

const router = express.Router();

router.get("/", protect, getMyConversations);

router.get("/private/:userId", protect, getOrCreatePrivateConversation);
router.post("/group", protect, createGroupConversation);
router.patch("/update-seen", protect, updateSeen);

router
	.route("/:conversationId/messages")
	.get(protect, getConversationMessages)
	.post(protect, upload.single("file"), optimizeMessageImage, sendMessage);

router.post("/:conversationId/admins/:userId", protect, addGroupAdmin);
router.delete("/:conversationId/admins/:userId", protect, removeGroupAdmin);

router.post(
	"/:conversationId/participants/:userId",
	protect,
	addGroupParticipant,
);
router.delete(
	"/:conversationId/participants/:userId",
	protect,
	removeGroupParticipant,
);

router.delete("/:conversationId/leave", protect, leaveGroup);

router.patch("/:conversationId/name", protect, updateGroupName);

router.patch(
	"/:conversationId/avatar",
	protect,
	upload.single("avatar"),
	optimizeGroupAvatar,
	updateGroupAvatar,
);

export default router;
