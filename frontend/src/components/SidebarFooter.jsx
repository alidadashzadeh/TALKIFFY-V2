import { useNavigate } from "react-router-dom";
import { LogOut, Settings, UserCircle2, MoreVertical } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuthContext } from "../contexts/AuthContext";
import useLogout from "../hooks/useLogout";

function SidebarFooter() {
	const { currentUser } = useAuthContext();
	const { logout } = useLogout();
	const navigate = useNavigate();

	const avatarUrl = currentUser?.avatar
		? import.meta.env.MODE === "development"
			? `http://localhost:5001/avatars/${currentUser.avatar}`
			: `https://talkiffy.onrender.com/avatars/${currentUser.avatar}`
		: "";

	const initials =
		(currentUser?.username?.[0] || "?").toUpperCase() +
		(currentUser?.username?.[1] || "").toUpperCase();

	const username = currentUser?.username || "User";

	const shortName =
		username.length < 6 ? username : username.slice(0, 6) + "...";

	return (
		<div className="flex items-center justify-between bg-brand text-text__secondary p-2">
			{/* Left: User Info (goes to profile) */}
			<div
				className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 hover:opacity-90 transition"
				onClick={() => navigate("/profile")}
			>
				{currentUser?.avatar ? (
					<Avatar className="h-10 w-10">
						<AvatarImage src={avatarUrl} alt={username} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				) : (
					<UserCircle2 className="h-10 w-10" />
				)}

				<div className="hidden md:flex flex-col leading-tight">
					<p className="font-bold lg:hidden">{shortName}</p>
					<p className="font-bold hidden lg:block">{username}</p>
				</div>
			</div>

			{/* Right: 3 Dots Dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						aria-label="Open user menu"
						className="p-2 rounded-md hover:bg-black/10 transition focus:outline-none focus:ring-2 focus:ring-ring"
					>
						<MoreVertical className="h-5 w-5" />
					</button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					align="start"
					side="top"
					className="w-56 text-left"
				>
					<DropdownMenuItem
						onClick={() => navigate("/settings")}
						className="!flex !flex-row !items-center !justify-start gap-2 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0"
					>
						<Settings />
						<span>Settings</span>
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={logout}
						className="!flex !flex-row !items-center !justify-start gap-2 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0"
					>
						<LogOut />
						<span>Logout</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default SidebarFooter;
