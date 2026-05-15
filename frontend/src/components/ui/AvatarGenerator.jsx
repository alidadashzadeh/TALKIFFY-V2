import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

function AvatarGenerator({ avatar, name, size = "h-10 w-10" }) {
	const fallback = getInitials(name);

	return (
		<Avatar className={size}>
			<AvatarImage src={avatar} alt={fallback} />
			<AvatarFallback className="flex items-center justify-center">
				{fallback}
			</AvatarFallback>
		</Avatar>
	);
}

export default AvatarGenerator;
