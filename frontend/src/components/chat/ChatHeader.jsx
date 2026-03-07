import AvatarGenerator from "../AvatarGenerator";
import { useContactContext } from "@/contexts/ContactContext";

function ChatHeader() {
	const { currentContact } = useContactContext();

	return (
		<header className="w-full border-b bg-background px-4 py-3">
			<div className="flex min-w-0 items-center gap-3">
				<AvatarGenerator
					avatar={currentContact?.avatar}
					name={currentContact?.username}
				/>

				<div className="min-w-0">
					<h2 className="truncate font-semibold">{currentContact?.username}</h2>
				</div>
			</div>
		</header>
	);
}

export default ChatHeader;
