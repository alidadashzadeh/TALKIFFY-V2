import express from "express";

import {
	checkAuth,
	login,
	logout,
	protect,
	signup,
} from "../controllers/authController.js";
import {
	updateUserAvatar,
	addNewContact,
} from "../controllers/userController.js";
import { optimizeUserAvatar } from "../lib/middleware/OptimizeImage.js";
import upload from "../lib/middleware/upload.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/contacts", protect, addNewContact);
router.get("/check", protect, checkAuth);
router
	.route("/:id")
	.patch(
		protect,
		upload.single("avatar"),
		optimizeUserAvatar,
		updateUserAvatar,
	);

export default router;
