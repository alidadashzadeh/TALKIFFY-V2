import express from "express";
import {
	createGroupConversation,
	getMyConversations,
	getOrCreatePrivateConversation,
} from "../controllers/conversationController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router
	.route("/")
	.get(protect, getMyConversations)
	.post(protect, createGroupConversation);

router.get("/private/:userId", protect, getOrCreatePrivateConversation);

export default router;
