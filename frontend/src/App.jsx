import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import MessageLoading from "./components/chat/ChatLoading.jsx";
import useCurrentUser from "./hooks/user/useCurrentUser.js";

function App() {
	const { data: currentUser, isLoading } = useCurrentUser();

	if (isLoading && !currentUser) return <MessageLoading />;

	return (
		<div className="min-h-dvh">
			<Routes>
				<Route
					path="/"
					element={
						currentUser && !isLoading ? <HomePage /> : <Navigate to="/login" />
					}
				/>
				<Route
					path="/signup"
					element={!currentUser ? <SignupPage /> : <Navigate to="/" />}
				/>
				<Route
					path="/login"
					element={!currentUser ? <LoginPage /> : <Navigate to="/" />}
				/>
			</Routes>
		</div>
	);
}

export default App;
