import jwt from "jsonwebtoken";
import { promisify } from "util";

import User from "../models/userModel.js";
import { createSendToken } from "../lib/utils.js";

export const signup = async (req, res) => {
	try {
		const newUser = await User.create({
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			passwordConfirm: req.body.passwordConfirm,
		});

		createSendToken(newUser, 201, res);
	} catch (error) {
		res.status(400).json({ status: "fail", message: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password)
			throw new Error("Please provide email and password");

		const user = await User.findOne({ email }).select("+password").populate({
			path: "contacts",
			select: " username email avatar",
		});

		if (!user || !(await user.isPasswordCorrect(password, user.password)))
			throw new Error("Wrong credential!");

		createSendToken(user, 200, res);
	} catch (error) {
		res.status(401).json({ status: "fail", message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", {
			expiresIn: new Date(Date.now() + 1 * 1000),
			httpOnly: true,
		});
		res.status(200).json({ status: "success" });
	} catch (error) {
		res.status(400).json({ status: "fail", message: error.message });
	}
};

export const protect = async (req, res, next) => {
	try {
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
			throw new Error("You are not logged in, Please login to continue!");

		const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
		const currentUser = await User.findById(decode.id);
		if (!currentUser)
			throw new Error("The user belonging to token no longer exist!");

		if (!currentUser.hasChangedPasswordAfter(decode.iat))
			throw new Error(
				"The user has changed password recently, PLease login again!",
			);

		req.user = currentUser;

		next();
	} catch (error) {
		res.status(401).json({ status: "fail", message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate({
			path: "contacts",
			select: " username email avatar",
		});

		res.status(200).json({ status: "success", data: { user } });
	} catch (error) {
		res.status(400).json({ status: "fail", message: error.message });
	}
};
