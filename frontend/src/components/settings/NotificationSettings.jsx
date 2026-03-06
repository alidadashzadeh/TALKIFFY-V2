import { PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

import { useSettingContext } from "@/contexts/SettingContext";
import SettingSectionHeader from "./SettingSectionHeader";

function NotificationSettings() {
	const { sounds, notifSound, setNotifSound, soundEnabled, setSoundEnabled } =
		useSettingContext();

	const handleSoundChange = (value) => {
		setNotifSound(value);
		localStorage.setItem("notificationSound", value);
	};

	const handleToggleSound = (checked) => {
		setSoundEnabled(checked);
		localStorage.setItem("soundEnabled", JSON.stringify(checked));
	};

	const previewSound = (soundRef) => {
		if (!soundEnabled) return;
		new Audio(sounds[soundRef]).play();
	};

	return (
		<div className="space-y-4">
			<SettingSectionHeader
				title="Notifications"
				description="Control how message alerts behave"
			/>

			<div className="flex items-center justify-between rounded-lg border border-border p-4">
				<div className="space-y-1">
					<p className="text-sm font-medium">Message Sounds</p>
					<p className="text-sm text-muted-foreground">
						Play a sound for incoming messages
					</p>
				</div>

				<Switch checked={soundEnabled} onCheckedChange={handleToggleSound} />
			</div>

			<div className="space-y-3">
				<div>
					<p className="text-sm font-medium">Notification Sound</p>
					<p className="text-sm text-muted-foreground">
						Choose the sound for new message notifications
					</p>
				</div>

				<RadioGroup
					value={notifSound}
					onValueChange={handleSoundChange}
					className="gap-3"
				>
					{["notif1", "notif2", "notif3"].map((key, idx) => (
						<div
							key={key}
							className="flex items-center justify-between rounded-lg border border-border px-3 py-3"
						>
							<label
								htmlFor={key}
								className="flex cursor-pointer items-center gap-3"
							>
								<RadioGroupItem id={key} value={key} disabled={!soundEnabled} />
								<span
									className={`text-sm ${!soundEnabled ? "opacity-50" : ""}`}
								>
									{`Notification ${idx + 1}`}
								</span>
							</label>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => previewSound(key)}
								disabled={!soundEnabled}
								aria-label={`Preview Notification ${idx + 1}`}
							>
								<PlayCircle className="h-5 w-5" />
							</Button>
						</div>
					))}
				</RadioGroup>
			</div>
		</div>
	);
}

export default NotificationSettings;
