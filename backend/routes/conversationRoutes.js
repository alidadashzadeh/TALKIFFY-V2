import express from "express";
import {
	getMyConversations,
	getOrCreatePrivateConversation,
} from "../controllers/conversationController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.get("/", protect, getMyConversations);
router.get("/private/:userId", protect, getOrCreatePrivateConversation);

export default router;
