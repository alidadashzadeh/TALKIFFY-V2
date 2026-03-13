import express from "express";
import {
	addGroupSingleParticipant,
	createGroupConversation,
	getMyConversations,
	getOrCreatePrivateConversation,
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
	addGroupSingleParticipant,
);
router.delete(
	"/:conversationId/participants/:userId",
	protect,
	removeGroupParticipant,
);

export default router;
