import { Check } from "lucide-react";

import { useSettingContext } from "@/contexts/SettingContext";
import SettingSectionHeader from "./SettingSectionHeader";
import { THEMES } from "@/constants/themes";

function ThemeSettings() {
	const { appTheme, setAppTheme } = useSettingContext();

	return (
		<div className="space-y-4">
			<SettingSectionHeader
				title="Appearance"
				description="Choose your app color theme"
			/>

			<div className="grid gap-3 sm:grid-cols-2">
				{THEMES.map((themeOption) => {
					const isActive = appTheme === themeOption.value;

					return (
						<button
							key={themeOption.value}
							type="button"
							onClick={() => setAppTheme(themeOption.value)}
							className={`flex items-center justify-between rounded-lg border p-4 text-left transition hover:bg-accent ${
								isActive
									? "border-primary bg-accent"
									: "border-border bg-background"
							}`}
						>
							<div>
								<p className="text-sm font-medium">{themeOption.label}</p>
								<p className="text-xs text-muted-foreground">
									{themeOption.description}
								</p>
							</div>

							<div className="flex items-center gap-3">
								<div className="flex gap-1">
									{themeOption.colors.map((color, index) => (
										<span
											key={index}
											className={`h-4 w-4 rounded-full border ${color}`}
										/>
									))}
								</div>

								{isActive && <Check className="h-4 w-4 text-primary" />}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default ThemeSettings;
