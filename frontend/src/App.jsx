import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import { useAuthContext } from "./contexts/AuthContext.jsx";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import useCheckCurrentUser from "./hooks/useCheckingCurrentUser.js";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import MessageLoading from "./components/MessageLoading.jsx";

import useListenContacts from "./hooks/useListenContacts.js";
import useListenMessages from "./hooks/useListenSingleMessages.js";
import useListenDeliver from "./hooks/useListenSingleDeliver.js";
import useSetDeliverOnLogin from "./hooks/useSetDeliverOnLogin.js";
import useGetDeliverOnLogin from "./hooks/useGetDeliverOnLogin.js";
import useListenSeen from "./hooks/useListenSignleSeen.js";
import useSeenMessagesOnClick from "./hooks/useSeenMessagesOnClick.js";
import useGetUnseenMessagesOnLogin from "./hooks/useGetUnseenMessagesOnLogin.js";

function App() {
	const { loading, checkAuth } = useCheckCurrentUser();
	const { currentUser } = useAuthContext();

	useListenContacts();
	useListenMessages();
	useListenDeliver();
	useListenSeen();
	useSetDeliverOnLogin();
	useGetDeliverOnLogin();
	useSeenMessagesOnClick();
	useGetUnseenMessagesOnLogin();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (loading && !currentUser) return <MessageLoading />;

	return (
		<div className="min-h-dvh">
			<Routes>
				<Route
					path="/"
					element={currentUser ? <HomePage /> : <Navigate to="/login" />}
				/>
				<Route
					path="/signup"
					element={!currentUser ? <SignupPage /> : <Navigate to="/" />}
				/>
				<Route
					path="/login"
					element={!currentUser ? <LoginPage /> : <Navigate to="/" />}
				/>
				<Route
					path="/settings"
					element={!currentUser ? <LoginPage /> : <SettingsPage />}
				/>
				<Route
					path="/profile"
					element={!currentUser ? <LoginPage /> : <ProfilePage />}
				/>
			</Routes>
		</div>
	);
}

export default App;
