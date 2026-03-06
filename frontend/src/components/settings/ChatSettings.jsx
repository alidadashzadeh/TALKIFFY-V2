import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

import { useSettingContext } from "@/contexts/SettingContext";
import SettingSectionHeader from "./SettingSectionHeader";

function ChatSettings() {
	const {
		enterToSend,
		setEnterToSend,
		timeFormat,
		setTimeFormat,
		compactMode,
		setCompactMode,
	} = useSettingContext();

	const handleEnterToSend = (checked) => {
		setEnterToSend(checked);
		localStorage.setItem("enterToSend", JSON.stringify(checked));
	};

	const handleCompactMode = (checked) => {
		setCompactMode(checked);
		localStorage.setItem("compactMode", JSON.stringify(checked));
	};

	const handleTimeFormatChange = (value) => {
		setTimeFormat(value);
		localStorage.setItem("timeFormat", value);
	};

	return (
		<div className="space-y-4">
			<SettingSectionHeader
				title="Chat"
				description="Customize how chatting feels"
			/>

			<div className="flex items-center justify-between rounded-lg border border-border p-4">
				<div className="space-y-1">
					<p className="text-sm font-medium">Enter to Send</p>
					<p className="text-sm text-muted-foreground">
						Press Enter to send messages
					</p>
				</div>

				<Switch checked={enterToSend} onCheckedChange={handleEnterToSend} />
			</div>

			<div className="flex items-center justify-between rounded-lg border border-border p-4">
				<div className="space-y-1">
					<p className="text-sm font-medium">Compact Mode</p>
					<p className="text-sm text-muted-foreground">
						Reduce spacing in chats and lists
					</p>
				</div>

				<Switch checked={compactMode} onCheckedChange={handleCompactMode} />
			</div>

			<div className="space-y-3">
				<div>
					<p className="text-sm font-medium">Time Format</p>
					<p className="text-sm text-muted-foreground">
						Choose how message times are displayed
					</p>
				</div>

				<RadioGroup
					value={timeFormat}
					onValueChange={handleTimeFormatChange}
					className="gap-3"
				>
					<div className="flex items-center gap-3 rounded-lg border border-border px-3 py-3">
						<RadioGroupItem id="12h" value="12h" />
						<label htmlFor="12h" className="cursor-pointer text-sm">
							12-hour
						</label>
					</div>

					<div className="flex items-center gap-3 rounded-lg border border-border px-3 py-3">
						<RadioGroupItem id="24h" value="24h" />
						<label htmlFor="24h" className="cursor-pointer text-sm">
							24-hour
						</label>
					</div>
				</RadioGroup>
			</div>
		</div>
	);
}

export default ChatSettings;
