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
} from "../controllers/conversationController.js";
import { protect } from "../controllers/authController.js";
import upload from "../lib/middleware/upload.js";
import { optimizeGroupAvatar } from "../lib/middleware/OptimizeImage.js";

const router = express.Router();

router.route("/").get(protect, getMyConversations);

router.get("/private/:userId", protect, getOrCreatePrivateConversation);
router.post("/group", protect, createGroupConversation);

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
router.post("/:conversationId/admins/:userId", protect, addGroupAdmin);
router.delete("/:conversationId/admins/:userId", protect, removeGroupAdmin);
router.delete("/:conversationId/leave", protect, leaveGroup);

router.patch(
	"/:conversationId/avatar",
	protect,
	upload.single("avatar"),
	optimizeGroupAvatar,
	updateGroupAvatar,
);

export default router;
