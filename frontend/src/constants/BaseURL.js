export const baseURL =
	import.meta.env.MODE === "development"
		? "http://localhost:5001"
		: "https://talkiffy.onrender.com";
