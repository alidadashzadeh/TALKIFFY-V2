import express from "express";
import {
	addGroupParticipants,
	createGroupConversation,
	getMyConversations,
	getOrCreatePrivateConversation,
	removeGroupParticipant,
} from "../controllers/conversationController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.route("/").get(protect, getMyConversations);
// .post(protect, createGroupConversation);

router.get("/private/:userId", protect, getOrCreatePrivateConversation);
router.post("/group", protect, createGroupConversation);

// router.patch("/:conversationId", protect, updateGroupParticipants);
router.post("/:conversationId/participants", protect, addGroupParticipants);
router.delete(
	"/:conversationId/participants/:userId",
	protect,
	removeGroupParticipant,
);

// router.post("/:id/admins", protect, promoteGroupAdmin);
// router.delete("/:id/admins/:userId", protect, demoteGroupAdmin);

// router.patch("/:id/group-info", protect, updateGroupInfo);

export default router;
