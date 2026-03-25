import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";

import useUploadImage from "../hooks/useUploadImage";
import useCurrentUser from "@/hooks/user/useCurrentUser";

function ProfilePage() {
	const { data: currentUser } = useCurrentUser();
	const { loading, handleImageUpload } = useUploadImage();
	const navigate = useNavigate();

	const avatarSrc =
		import.meta.env.MODE === "development"
			? `http://localhost:5001/avatars/${currentUser.avatar}`
			: `https://talkiffy.onrender.com/avatars/${currentUser.avatar}`;

	return (
		<div className="h-screen w-screen flex justify-center items-center bg-background__primary text-text__primary">
			<div className="flex flex-col items-center relative py-4 px-6 rounded-2xl w-[90%] sm:w-[60%] md:w-[50%] lg:w-[40%] max-w-[500px] bg-background__secondary">
				{/* Back */}
				<Button
					type="button"
					variant="outline"
					className="absolute top-4 left-4 text-text__primary"
					onClick={() => navigate("/")}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>

				<p className="text-xl">Profile</p>
				<p>Your information</p>

				{/* Avatar */}
				<div className="flex items-center gap-4 p-6 relative">
					<img
						className="size-32 rounded-full object-cover border-4 border-border"
						alt="profile"
						src={avatarSrc}
					/>

					<Button
						type="button"
						size="icon"
						variant="secondary"
						className="absolute left-28 bottom-8 rounded-full"
						disabled={loading}
						asChild
					>
						<label>
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

				{/* Username */}
				<div className="py-4 mx-6 w-full">
					<p className="flex gap-2 items-center">
						<User className="h-4 w-4" />
						User Name
					</p>
					<input
						className="w-full outline-none bg-background__secondary border-b-2 border-border opacity-50"
						value={currentUser.username}
						disabled
						readOnly
					/>
				</div>

				{/* Email */}
				<div className="py-4 mx-6 w-full">
					<p className="flex gap-2 items-center">
						<Mail className="h-4 w-4" />
						Email
					</p>
					<input
						className="w-full outline-none bg-background__secondary border-b-2 border-border opacity-50"
						value={currentUser.email}
						disabled
						readOnly
					/>
				</div>

				{/* Account info */}
				<div className="w-full p-4 rounded-md">
					<p className="text-xl">Account Information</p>

					<div className="flex justify-between border-b-2 border-border p-1">
						<p>Member Since</p>
						<p>{new Date(currentUser.createdAt).toLocaleDateString("en-GB")}</p>
					</div>

					<div className="flex justify-between p-1">
						<p>Account Status</p>
						<p className="text-green-500">Active</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;
