import { useAuthContext } from "@/contexts/AuthContext";
import { SheetHeader, SheetTitle } from "../ui/sheet";
import { UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function AccountSheetHeader() {
	const { currentUser } = useAuthContext();

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
		username.length < 16 ? username : username.slice(0, 16) + "...";
	return (
		<SheetHeader className="p-4 pb-3 ">
			<SheetTitle className="flex items-center gap-3">
				{currentUser?.avatar ? (
					<Avatar className="h-10 w-10">
						<AvatarImage src={avatarUrl} alt={username} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				) : (
					<div className="grid h-10 w-10 place-items-center rounded-full bg-muted">
						<UserCircle className="h-7 w-7 text-muted-foreground" />
					</div>
				)}

				<div className="min-w-0 leading-tight">
					<p className="truncate text-sm font-semibold">{shortName}</p>
					<p className="truncate text-xs text-muted-foreground">
						{currentUser?.email || " "}
					</p>
				</div>
			</SheetTitle>
		</SheetHeader>
	);
}

export default AccountSheetHeader;
