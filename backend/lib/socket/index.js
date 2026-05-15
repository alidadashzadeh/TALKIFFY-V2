import express from "express";
import http from "http";
import { Server } from "socket.io";

import { socketAuth } from "./socketAuth.js";
import { registerSocketHandlers } from "./socketHandlers.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin:
			process.env.NODE_ENV === "production"
				? "https://talkiffy.vercel.app"
				: "http://localhost:5173",
		credentials: true,
	},
});

io.use(socketAuth);
registerSocketHandlers(io);

export { app, server, io };
