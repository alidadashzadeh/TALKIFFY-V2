import { useMemo, useState } from "react";
import { Info, MoreVertical, Phone, Search, Video, X } from "lucide-react";

import { useAuthContext } from "@/contexts/AuthContext";
import { useContactContext } from "@/contexts/ContactContext";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ChatHeader() {
	const { currentContactId } = useContactContext();
	const { currentUser } = useAuthContext();

	const [isSearching, setIsSearching] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	const currentContact = currentUser?.contacts?.find(
		(contact) => contact._id === currentContactId,
	);

	const avatarUrl = useMemo(() => {
		if (!currentContact?.avatar) return "";

		return import.meta.env.MODE === "development"
			? `http://localhost:5001/avatars/${currentContact.avatar}`
			: `https://talkiffy.onrender.com/avatars/${currentContact.avatar}`;
	}, [currentContact?.avatar]);

	if (!currentContact) return null;

	const initials =
		(currentContact.username?.[0] || "?").toUpperCase() +
		(currentContact.username?.[1] || "").toUpperCase();

	const statusText = currentContact?.isOnline
		? "Online"
		: currentContact?.lastSeen
			? `Last seen ${currentContact.lastSeen}`
			: "Offline";

	const handleOpenSearch = () => {
		setIsSearching(true);
	};

	const handleCloseSearch = () => {
		setIsSearching(false);
		setSearchValue("");
	};

	const handleSearchChange = (e) => {
		setSearchValue(e.target.value);

		// later:
		// connect this to your MessagesContext or parent state
		// setMessageSearchQuery(e.target.value)
	};

	return (
		<header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
			<div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-3 px-4">
				<div className="flex min-w-0 items-center gap-3">
					<Avatar className="h-10 w-10 border">
						<AvatarImage src={avatarUrl} alt={currentContact.username} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>

					<div className="min-w-0">
						<p className="truncate text-sm font-semibold text-foreground">
							{currentContact.username}
						</p>
						<p className="truncate text-xs text-muted-foreground">
							{statusText}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-1">
					{isSearching ? (
						<div className="flex items-center gap-2">
							<Input
								value={searchValue}
								onChange={handleSearchChange}
								placeholder="Search messages..."
								className="h-9 w-[180px] sm:w-[240px]"
								autoFocus
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={handleCloseSearch}
								aria-label="Close search"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					) : (
						<>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={handleOpenSearch}
								aria-label="Search messages"
							>
								<Search className="h-4 w-4" />
							</Button>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label="Voice call"
							>
								<Phone className="h-4 w-4" />
							</Button>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label="Video call"
							>
								<Video className="h-4 w-4" />
							</Button>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label="Contact info"
							>
								<Info className="h-4 w-4" />
							</Button>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										aria-label="More options"
									>
										<MoreVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuItem>View profile</DropdownMenuItem>
									<DropdownMenuItem>Shared media</DropdownMenuItem>
									<DropdownMenuItem>Search in chat</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>Mute notifications</DropdownMenuItem>
									<DropdownMenuItem>Pin conversation</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem className="text-destructive focus:text-destructive">
										Delete conversation
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					)}
				</div>
			</div>
		</header>
	);
}

export default ChatHeader;
