import express from "express";

import { reactToMessage } from "../controllers/messageController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.patch("/:messageId/reaction", protect, reactToMessage);

export default router;
