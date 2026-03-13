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
} from "../controllers/conversationController.js";
import { protect } from "../controllers/authController.js";

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

export default router;
