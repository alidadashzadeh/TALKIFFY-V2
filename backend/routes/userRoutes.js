import express from "express";

import {
	checkAuth,
	login,
	logout,
	protect,
	signup,
} from "../controllers/authController.js";
import {
	getAllUsers,
	createUser,
	getUser,
	deleteUser,
	updateUserAvatar,
	addNewContact,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/check", protect, checkAuth);
router.route("/").get(getAllUsers).post(createUser);
router
	.route("/:id")
	.get(getUser)
	.patch(protect, updateUserAvatar)
	.delete(deleteUser);

router.post("/contacts", protect, addNewContact);

export default router;
