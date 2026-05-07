import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import ThemeSettings from "./ThemeSettings";
import NotificationSettings from "./NotificationSettings";

function SettingsModal() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" className="flex w-full justify-start gap-2">
					<Settings className="h-4 w-4" />
					Settings
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>Manage your app preferences</DialogDescription>
				</DialogHeader>

				<div className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto pr-1">
					<ThemeSettings />
					<NotificationSettings />
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default SettingsModal;
