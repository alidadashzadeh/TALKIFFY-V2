import User from "../models/userModel.js";
import sharp from "sharp";

import { fileURLToPath } from "url";

import { createOne, deleteOne, getAll, getOne } from "./handleFactory.js";
import upload from "../lib/middleware/upload.js";
import { uploadBufferToCloudinary } from "../lib/cloudinaryUpload.js";

const __filename = fileURLToPath(import.meta.url);

export const getAllUsers = getAll(User);
export const createUser = createOne(User);
export const getUser = getOne(User, {
	path: "contacts",
	select: "email username avatar",
});
export const deleteUser = deleteOne(User);

export const updateUserAvatar = async (req, res) => {
	try {
		const { id } = req.params;

		if (String(req.user._id) !== String(id)) {
			return res.status(403).json({
				status: "fail",
				message: "You are not allowed to update this user",
			});
		}

		if (!req.file) {
			return res.status(400).json({
				status: "fail",
				message: "Please upload an image",
			});
		}

		const uploaded = await uploadBufferToCloudinary(
			req.file.buffer,
			"talkiffy/users",
		);

		const updatedUser = await User.findByIdAndUpdate(
			id,
			{ avatar: uploaded.secure_url },
			{ new: true, runValidators: true },
		).select("-password");

		return res.status(200).json({
			status: "success",
			data: {
				user: updatedUser,
			},
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: error.message || "Something went wrong",
		});
	}
};

export const addNewContact = async (req, res) => {
	try {
		const currentUserId = req.user._id;
		const { email } = req.body;

		const normalizedEmail = email?.trim().toLowerCase();

		if (!normalizedEmail) {
			return res.status(400).json({
				status: "fail",
				message: "Please provide an email address",
			});
		}

		const currentUser = await User.findById(currentUserId);

		if (!currentUser) {
			return res.status(404).json({
				status: "fail",
				message: "Current user not found",
			});
		}

		if (currentUser.email?.toLowerCase() === normalizedEmail) {
			return res.status(400).json({
				status: "fail",
				message: "You cannot add yourself to contacts",
			});
		}

		const foundUser = await User.findOne({ email: normalizedEmail });

		if (!foundUser) {
			return res.status(404).json({
				status: "fail",
				message: "There is no user with the provided email",
			});
		}

		if (
			currentUser.contacts.some(
				(contact) => String(contact) === String(foundUser._id),
			)
		) {
			return res.status(400).json({
				status: "fail",
				message: "This user is already in your contact list",
			});
		}

		await User.findByIdAndUpdate(currentUserId, {
			$addToSet: { contacts: foundUser._id },
		});

		await User.findByIdAndUpdate(foundUser._id, {
			$addToSet: { contacts: currentUserId },
		});

		const updatedCurrentUser = await User.findById(currentUserId).populate({
			path: "contacts",
			select: "username email avatar",
		});

		return res.status(200).json({
			status: "success",
			data: {
				user: updatedCurrentUser,
				contactId: foundUser._id,
			},
		});
	} catch (error) {
		return res.status(500).json({
			status: "error",
			message: error.message || "Failed to add contact",
		});
	}
};
