import jwt from "jsonwebtoken";
import AppError from "./AppError.js";

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

export const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") {
		cookieOptions.secure = true;
		cookieOptions.sameSite = "None";
	}

	res.cookie("jwt", token, cookieOptions);

	// Remove password from output
	user.password = undefined;

	res.status(statusCode).json({
		status: "success",
		data: {
			user,
		},
	});
};

export const buildPrivateConversationKey = (userId1, userId2) => {
	const [a, b] = [userId1.toString(), userId2.toString()].sort();
	return `private_${a}_${b}`;
};

export const ensureConversationExists = (conversation) => {
	if (!conversation) {
		throw new AppError("Conversation not found", 404);
	}
};

export const ensureGroupConversation = (conversation) => {
	if (conversation.type !== "group") {
		throw new AppError("Only group conversations allowed", 400);
	}
};

export const isAdmin = (conversation, userId) => {
	return conversation.admins.some(
		(admin) => String(admin._id || admin) === String(userId),
	);
};

export const isParticipant = (conversation, userId) => {
	return conversation.participants.some(
		(p) => String(p._id || p) === String(userId),
	);
};

export const ensureAdmin = (conversation, userId) => {
	if (!isAdmin(conversation, userId)) {
		throw new AppError("Only admins can perform this action", 403);
	}
};
export const alreadyAdmin = (conversation, userId) => {
	if (isAdmin(conversation, userId)) {
		throw new AppError("User is already an admin", 400);
	}
};

export const ensureParticipant = (conversation, userId) => {
	if (!isParticipant(conversation, userId)) {
		throw new AppError("User is not a participant", 400);
	}
};
export const alreadyParticipant = (conversation, userId) => {
	if (isParticipant(conversation, userId)) {
		throw new AppError("User is already a participant", 400);
	}
};
