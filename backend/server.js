import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { server, app } from "./lib/socket/index.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import globalErrorHandler from "./lib/middleware/error.middleware.js";
import AppError from "./lib/AppError.js";

dotenv.config();

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use(
	cors({
		origin:
			process.env.NODE_ENV === "production"
				? "https://talkiffy.vercel.app"
				: "http://localhost:5173",
		credentials: true,
	}),
);

// Health check route
app.get("/health", (req, res) => {
	res.status(200).json({
		status: "success",
		message: "Talkiffy backend is running",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	});
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/conversations", conversationRouter);

app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

mongoose
	.connect(process.env.MONGODB_URI, {})
	.then(() => console.log("DB connection successful!"))
	.catch((err) => console.error("DB connection error:", err));

const port = process.env.PORT || 5001;

server.listen(port, () => {
	console.log(`App running on port ${port}...`);
});
