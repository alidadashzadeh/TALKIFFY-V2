import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

function DarkModeSwitch() {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		const stored = localStorage.getItem("theme");
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;

		const initialTheme =
			stored === "dark" || (!stored && prefersDark) ? "dark" : "light";

		setTheme(initialTheme);
		document.documentElement.classList.toggle("dark", initialTheme === "dark");
	}, []);

	const applyTheme = (newTheme) => {
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	};

	const handleToggleTheme = (e) => {
		const newTheme = theme === "dark" ? "light" : "dark";

		const x = e.clientX;
		const y = e.clientY;

		const maxX = Math.max(x, window.innerWidth - x);
		const maxY = Math.max(y, window.innerHeight - y);
		const r = Math.hypot(maxX, maxY);

		if (document.startViewTransition) {
			document.documentElement.style.setProperty("--vt-x", `${x}px`);
			document.documentElement.style.setProperty("--vt-y", `${y}px`);
			document.documentElement.style.setProperty("--vt-from", `0px`);
			document.documentElement.style.setProperty("--vt-to", `${r}px`);

			document.startViewTransition(() => {
				applyTheme(newTheme);
			});
		} else {
			applyTheme(newTheme);
		}
	};

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={handleToggleTheme}
			aria-label="Toggle theme"
		>
			{theme === "light" ? (
				<Moon className="h-5 w-5" />
			) : (
				<Sun className="h-5 w-5 text-yellow-400" />
			)}
		</Button>
	);
}

export { DarkModeSwitch };
