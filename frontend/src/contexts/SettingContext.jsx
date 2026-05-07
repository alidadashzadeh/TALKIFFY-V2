import { createContext, useContext, useState, useEffect } from "react";

import notifSound1 from "./../sounds/notifSound1.mp3";
import soynoviembre from "./../sounds/soynoviembre.mp3";
import bell1 from "./../sounds/bell1.mp3";
import bell2 from "./../sounds/bell2.mp3";
import bell3 from "./../sounds/bell3.mp3";
import bell4 from "./../sounds/bell4.mp3";
import quiandrea from "./../sounds/quiandrea.mp3";

const SettingContext = createContext();

export const useSettingContext = () => useContext(SettingContext);

export const SettingContextProvider = ({ children }) => {
	const sounds = {
		notif1: {
			src: notifSound1,
			label: "Notification 1",
		},
		soynoviembre: {
			src: soynoviembre,
			label: "Soy Noviembre",
		},
		bell1: {
			src: bell1,
			label: "Bell 1",
		},
		bell2: {
			src: bell2,
			label: "Bell 2",
		},
		bell3: {
			src: bell3,
			label: "Bell 3",
		},
		bell4: {
			src: bell4,
			label: "Bell 4",
		},
		quiandrea: {
			src: quiandrea,
			label: "Qui Andrea",
		},
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
				sounds,
			}}
		>
			{children}
		</SettingContext.Provider>
	);
};
