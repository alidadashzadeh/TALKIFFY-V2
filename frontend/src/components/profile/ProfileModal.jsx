import { UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { useAuthContext } from "@/contexts/AuthContext";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfoField from "./ProfileInfoField";
import ProfileAccountInfo from "./ProfileAccountInfo";
import useUpdateUserAvatar from "@/hooks/useUpdateUserAvatar";
import { useState } from "react";

function ProfileModal() {
	const { currentUser } = useAuthContext();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" className="flex w-full justify-start gap-2">
					<UserIcon className="h-4 w-4" />
					Profile
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Profile</DialogTitle>
					<DialogDescription>Your information</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col items-center">
					<ProfileAvatar currentUser={currentUser} />

					<ProfileInfoField
						icon="user"
						label="User Name"
						value={currentUser?.username || ""}
					/>

					<ProfileInfoField
						icon="mail"
						label="Email"
						value={currentUser?.email || ""}
					/>

					<ProfileAccountInfo createdAt={currentUser?.createdAt} />
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default ProfileModal;
