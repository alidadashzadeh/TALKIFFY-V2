/* eslint-disable react/prop-types */
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUpdateUserAvatar from "@/hooks/user/useUpdateUserAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function ProfileAvatar({ currentUser }) {
	const { updateUserAvatar, loading } = useUpdateUserAvatar();

	const handleImageUpload = async (e) => {
		const file = e.target.files?.[0];
		try {
			await updateUserAvatar({
				userId: currentUser._id,
				file,
			});
		} finally {
			e.target.value = "";
		}
	};

	return (
		<div className="relative flex items-center justify-center py-4">
			<Avatar className="w-24 h-24 object-cover">
				<AvatarImage src={currentUser?.avatar} alt={currentUser?.username} />
				<AvatarFallback className="flex items-center justify-center">
					{currentUser?.username}
				</AvatarFallback>
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
						disabled={loading}
					/>
				</label>
			</Button>
		</div>
	);
}

export default ProfileAvatar;
