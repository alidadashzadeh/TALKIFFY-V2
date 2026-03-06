import jwt from "jsonwebtoken";

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
		token,
		data: {
			user,
		},
	});
};

export const buildPrivateConversationKey = (userId1, userId2) => {
	const [a, b] = [userId1.toString(), userId2.toString()].sort();
	return `private_${a}_${b}`;
};
