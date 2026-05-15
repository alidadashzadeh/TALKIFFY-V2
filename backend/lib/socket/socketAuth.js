import cookie from "cookie";
import jwt from "jsonwebtoken";

export const socketAuth = (socket, next) => {
	try {
		const rawCookie = socket.handshake.headers.cookie;

		if (!rawCookie) {
			return next(new Error("Authentication error: No cookies found"));
		}

		const cookies = cookie.parse(rawCookie);
		const token = cookies.jwt;

		if (!token) {
			return next(new Error("Authentication error: No token found"));
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded?.id) {
			return next(new Error("Authentication error: Invalid token payload"));
		}

		socket.userId = String(decoded.id);

		next();
	} catch (error) {
		console.error("Socket auth error:", error.message);
		next(new Error("Authentication error"));
	}
};
