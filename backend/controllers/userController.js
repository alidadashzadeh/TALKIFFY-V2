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
	upload.single("avatar")(req, res, async (err) => {
		try {
			if (err) {
				return res.status(400).json({
					status: "fail",
					message: err.message || "Image upload failed",
				});
			}

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

			const optimizedImageBuffer = await sharp(req.file.buffer)
				.resize(300, 300, {
					fit: "cover",
				})
				.webp({ quality: 80 })
				.toBuffer();

			const uploaded = await uploadBufferToCloudinary(
				optimizedImageBuffer,
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
	});
};
