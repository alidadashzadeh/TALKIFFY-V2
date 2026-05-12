import User from "../models/userModel.js";
import catchAsync from "../lib/catchAsync.js";
import AppError from "../lib/AppError.js";
import { createOne, deleteOne, getAll, getOne } from "./handleFactory.js";
import { uploadBufferToCloudinary } from "../lib/cloudinaryUpload.js";
import { getUserSocketIds, io } from "../lib/socket.js";

export const updateUserAvatar = catchAsync(async (req, res) => {
	const { id } = req.params;

	if (String(req.user._id) !== String(id)) {
		throw new AppError("You are not allowed to update this user", 403);
	}

	if (!req.file) {
		throw new AppError("Please upload an image", 400);
	}

	const uploaded = await uploadBufferToCloudinary(
		req.file.buffer,
		"talkiffy/users",
	);

	const updatedUser = await User.findByIdAndUpdate(
		id,
		{ avatar: uploaded.secure_url },
		{ new: true, runValidators: true },
	)
		.select("-password")
		.populate({
			path: "contacts",
			select: "email username avatar",
		});

	if (!updatedUser) {
		throw new AppError("User not found", 404);
	}

	res.status(200).json({
		status: "success",
		data: {
			user: updatedUser,
		},
	});
});

export const addNewContact = catchAsync(async (req, res) => {
	const currentUserId = req.user._id;
	const { email } = req.body;

	const normalizedEmail = email?.trim().toLowerCase();

	if (!normalizedEmail) {
		throw new AppError("Please provide an email address", 400);
	}

	const currentUser = await User.findById(currentUserId);

	if (!currentUser) {
		throw new AppError("Current user not found", 404);
	}

	if (currentUser.email?.toLowerCase() === normalizedEmail) {
		throw new AppError("You cannot add yourself to contacts", 400);
	}

	const newContact = await User.findOne({ email: normalizedEmail });

	if (!newContact) {
		throw new AppError("There is no user with the provided email", 404);
	}

	if (
		currentUser.contacts.some(
			(contact) => String(contact) === String(newContact._id),
		)
	) {
		throw new AppError("This user is already in your contact list", 400);
	}

	await Promise.all([
		User.findByIdAndUpdate(currentUserId, {
			$addToSet: { contacts: newContact._id },
		}),

		User.findByIdAndUpdate(newContact._id, {
			$addToSet: { contacts: currentUserId },
		}),
	]);

	const updatedCurrentUser = await User.findById(currentUserId)
		.select("-password")
		.populate({
			path: "contacts",
			select: "username email avatar",
		});

	const newContactSocketIds = getUserSocketIds(newContact._id);

	if (newContactSocketIds?.length) {
		newContactSocketIds.forEach((socketId) => {
			io.to(socketId).emit("contact:added", {
				addedBy: {
					_id: currentUser._id,
					username: currentUser.username,
					email: currentUser.email,
					avatar: currentUser.avatar,
				},
			});
		});
	}

	res.status(200).json({
		status: "success",
		data: {
			user: updatedCurrentUser,
		},
	});
});

export const getAllUsers = getAll(User);
export const createUser = createOne(User);
export const getUser = getOne(User, {
	path: "contacts",
	select: "email username avatar",
});
export const deleteUser = deleteOne(User);
