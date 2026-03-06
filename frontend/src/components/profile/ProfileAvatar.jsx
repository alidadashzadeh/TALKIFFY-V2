import { Camera } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import useUploadImage from "@/hooks/useUploadImage";

function ProfileAvatar({ currentUser }) {
	const { loading, handleImageUpload } = useUploadImage();

	const avatarSrc = useMemo(() => {
		if (!currentUser?.avatar) return "";

		return import.meta.env.MODE === "development"
			? `http://localhost:5001/avatars/${currentUser.avatar}`
			: `https://talkiffy.onrender.com/avatars/${currentUser.avatar}`;
	}, [currentUser?.avatar]);

	const initials = currentUser?.username?.slice(0, 2).toUpperCase() || "U";

	return (
		<div className="relative flex items-center justify-center py-4">
			<Avatar className="h-32 w-32 border-4 border-border">
				<AvatarImage src={avatarSrc} alt="profile" />
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>

			<Button
				type="button"
				size="icon"
				variant="secondary"
				className="absolute bottom-4 right-0 rounded-full"
				disabled={loading}
				asChild
			>
				<label className="cursor-pointer">
					<Camera className="h-4 w-4" />
					<input
						type="file"
						hidden
						accept="image/*"
						onChange={handleImageUpload}
					/>
				</label>
			</Button>
		</div>
	);
}

export default ProfileAvatar;
