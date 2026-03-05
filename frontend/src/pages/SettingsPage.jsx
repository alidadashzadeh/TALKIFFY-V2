import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useSettingContext } from "../contexts/SettingContext";

function SettingsPage() {
	const { theme, setTheme, sounds, notifSound, setNotifSound } =
		useSettingContext();

	const navigate = useNavigate();

	const handleThemeToggle = () => {
		setTheme((t) => (t === "dark" ? "light" : "dark"));
	};

	const handleSoundChange = (value) => {
		setNotifSound(value);
		localStorage.setItem("notificationSound", value);
	};

	const previewSound = (soundRef) => {
		new Audio(sounds[soundRef]).play();
	};

	return (
		<div className="flex justify-center items-center h-full bg-background__primary">
			<div className="flex flex-col gap-4 bg-background__secondary p-8 rounded-xl w-[90%] max-w-[520px]">
				<p className="text-2xl p-2 font-bold text-text__primary border-b-2">
					SETTINGS
				</p>

				{/* Theme */}
				<div className="flex gap-4 items-center">
					<div className="text-text__primary font-bold">
						{theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
					</div>
					<Switch
						checked={theme === "dark"}
						onCheckedChange={handleThemeToggle}
					/>
				</div>

				{/* Notification Sound */}
				<div className="flex flex-col gap-3">
					<p className="text-2xl p-2 font-bold text-text__primary border-b-2">
						Select Notification Sound
					</p>

					<RadioGroup
						value={notifSound}
						onValueChange={handleSoundChange}
						className="gap-3"
					>
						{["notif1", "notif2", "notif3"].map((key, idx) => (
							<div
								key={key}
								className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
							>
								<label
									htmlFor={key}
									className="flex items-center gap-3 text-text__primary cursor-pointer"
								>
									<RadioGroupItem id={key} value={key} />
									<span>{`Notification ${idx + 1}`}</span>
								</label>

								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => previewSound(key)}
									aria-label={`Preview ${key}`}
								>
									<PlayCircle className="h-5 w-5" />
								</Button>
							</div>
						))}
					</RadioGroup>
				</div>

				{/* Back */}
				<Button
					type="button"
					variant="outline"
					className="text-text__primary"
					onClick={() => navigate("/")}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>
			</div>
		</div>
	);
}

export default SettingsPage;
