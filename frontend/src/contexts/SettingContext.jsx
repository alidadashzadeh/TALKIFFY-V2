// /* eslint-disable react/prop-types */
// /* eslint-disable react-refresh/only-export-components */
// // contexts/useSettingContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";

// import notifSound1 from "./../sounds/notifSound1.mp3";
// import notifSound2 from "./../sounds/notifSound2.mp3";
// import notifSound3 from "./../sounds/notifSound3.mp3";

// const SettingContext = createContext();

// export const useSettingContext = () => useContext(SettingContext);

// export const SettingContextProvider = ({ children }) => {
// 	const sounds = {
// 		notif1: notifSound1,
// 		notif2: notifSound2,
// 		notif3: notifSound3,
// 	};

// 	const [theme, setTheme] = useState(() => {
// 		return localStorage.getItem("theme") || "light";
// 	});

// 	const [notifSound, setNotifSound] = useState(() => {
// 		return localStorage.getItem("notificationSound") || "notif1";
// 	});

// 	if (!theme) document.documentElement.classList.add("light");

// 	useEffect(() => {
// 		document.documentElement.classList.remove("dark", "light");
// 		document.documentElement.classList.add(theme);
// 		localStorage.setItem("theme", theme);
// 	}, [theme]);

// 	return (
// 		<SettingContext.Provider
// 			value={{
// 				theme,
// 				setTheme,
// 				notifSound,
// 				setNotifSound,
// 				sounds,
// 			}}
// 		>
// 			{children}
// 		</SettingContext.Provider>
// 	);
// };

/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from "react";

import notifSound1 from "./../sounds/notifSound1.mp3";
import notifSound2 from "./../sounds/notifSound2.mp3";
import notifSound3 from "./../sounds/notifSound3.mp3";

const SettingContext = createContext();

export const useSettingContext = () => useContext(SettingContext);

export const SettingContextProvider = ({ children }) => {
	const sounds = {
		notif1: notifSound1,
		notif2: notifSound2,
		notif3: notifSound3,
	};

	const [theme, setTheme] = useState(() => {
		return localStorage.getItem("theme") || "light";
	});

	const [appTheme, setAppTheme] = useState(() => {
		return localStorage.getItem("appTheme") || "slate";
	});

	const [notifSound, setNotifSound] = useState(() => {
		return localStorage.getItem("notificationSound") || "notif1";
	});

	const [soundEnabled, setSoundEnabled] = useState(() => {
		const saved = localStorage.getItem("soundEnabled");
		return saved ? JSON.parse(saved) : true;
	});

	const [enterToSend, setEnterToSend] = useState(() => {
		const saved = localStorage.getItem("enterToSend");
		return saved ? JSON.parse(saved) : true;
	});

	const [timeFormat, setTimeFormat] = useState(() => {
		return localStorage.getItem("timeFormat") || "24h";
	});

	const [compactMode, setCompactMode] = useState(() => {
		const saved = localStorage.getItem("compactMode");
		return saved ? JSON.parse(saved) : false;
	});

	useEffect(() => {
		document.documentElement.classList.remove("dark", "light");
		document.documentElement.classList.add(theme);
		localStorage.setItem("theme", theme);
	}, [theme]);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", appTheme);
		localStorage.setItem("appTheme", appTheme);
	}, [appTheme]);

	useEffect(() => {
		localStorage.setItem("notificationSound", notifSound);
	}, [notifSound]);

	useEffect(() => {
		localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
	}, [soundEnabled]);

	useEffect(() => {
		localStorage.setItem("enterToSend", JSON.stringify(enterToSend));
	}, [enterToSend]);

	useEffect(() => {
		localStorage.setItem("timeFormat", timeFormat);
	}, [timeFormat]);

	useEffect(() => {
		localStorage.setItem("compactMode", JSON.stringify(compactMode));
	}, [compactMode]);

	return (
		<SettingContext.Provider
			value={{
				theme,
				setTheme,
				appTheme,
				setAppTheme,
				notifSound,
				setNotifSound,
				soundEnabled,
				setSoundEnabled,
				enterToSend,
				setEnterToSend,
				timeFormat,
				setTimeFormat,
				compactMode,
				setCompactMode,
				sounds,
			}}
		>
			{children}
		</SettingContext.Provider>
	);
};
