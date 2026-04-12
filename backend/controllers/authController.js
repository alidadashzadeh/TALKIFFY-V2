import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/userModel.js";
import { createSendToken } from "../lib/utils.js";
import catchAsync from "../lib/catchAsync.js";
import AppError from "../lib/AppError.js";

export const signup = catchAsync(async (req, res, next) => {
	const { email, username, password, passwordConfirm } = req.body;

	if (!email || !username || !password || !passwordConfirm) {
		throw new AppError("Missing information", 400);
	}

	if (password !== passwordConfirm) {
		throw new AppError("Passwords do not match", 400);
	}

	const existingUser = await User.findOne({
		$or: [{ email }, { username }],
	});

	if (existingUser && existingUser.email === email) {
		throw new AppError("Email already in use", 400);
	}

	const newUser = await User.create({
		email,
		username,
		password,
		passwordConfirm,
	});

	createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new AppError("Please provide email and password", 400);
	}

	const user = await User.findOne({ email }).select("+password").populate({
		path: "contacts",
		select: "username email avatar",
	});

	if (!user || !(await user.isPasswordCorrect(password, user.password))) {
		throw new AppError("Wrong credentials!", 401);
	}

	createSendToken(user, 200, res);
});

export const logout = catchAsync(async (req, res, next) => {
	res.cookie("jwt", "", {
		expires: new Date(Date.now() + 1000),
		httpOnly: true,
	});

	res.status(200).json({
		status: "success",
	});
});

export const protect = catchAsync(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token)
		throw new AppError("You are not logged in, Please login to continue!", 401);

	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	const currentUser = await User.findById(decoded.id);

	if (!currentUser)
		throw new AppError("The user belonging to token no longer exist!", 401);

	if (!currentUser.hasChangedPasswordAfter(decoded.iat))
		throw new AppError(
			"The user has changed password recently, Please login again!",
			401,
		);

	req.user = currentUser;
	next();
});

export const checkAuth = catchAsync(async (req, res, next) => {
	if (!req.user?._id) {
		throw new AppError("User not authenticated", 401);
	}

	const user = await User.findById(req.user._id).populate({
		path: "contacts",
		select: "username email avatar",
	});

	if (!user) {
		throw new AppError("User no longer exists", 401);
	}

	res.status(200).json({
		status: "success",
		data: { user },
	});
});
