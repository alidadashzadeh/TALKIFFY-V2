import { getAvatarUrl, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function AvatarGenerator({ avatar, name, size = "h-10 w-10" }) {
	const fallback = getInitials(name);
	const avatarUrl = getAvatarUrl(avatar);

	return (
		<Avatar className={size}>
			<AvatarImage src={avatarUrl} alt={name} />
			<AvatarFallback className="flex items-center justify-center">
				{fallback}
			</AvatarFallback>
		</Avatar>
	);
}

export default AvatarGenerator;
