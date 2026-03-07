/* eslint-disable react/prop-types */
import { Camera } from "lucide-react";
import {} from "react";
import { Button } from "@/components/ui/button";
import useUploadImage from "@/hooks/useUploadImage";
import AvatarGenerator from "../AvatarGenerator";

function ProfileAvatar({ currentUser }) {
	const { loading, handleImageUpload } = useUploadImage();

	return (
		<div className="relative flex items-center justify-center py-4">
			<AvatarGenerator
				avatar={currentUser?.avatar}
				name={currentUser?.username}
				size="w-24 h-24"
			/>
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
