import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { useSheetModalContext } from "@/contexts/SheetModalProvider";

import useGetMessages from "@/hooks/messages/useGetMessages";
import useMessageSearch from "@/hooks/messages/useMessageSearch";
import { useMessageScroll } from "@/contexts/MessageScrollContext ";
import AvatarGenerator from "../AvatarGenerator";

function MessageSearchPopover() {
	const { messages } = useGetMessages();
	const { scrollToMessage } = useMessageScroll();

	const {
		messageSearchOpen,
		setMessageSearchOpen,
		messageSearchValue,
		setMessageSearchValue,
	} = useSheetModalContext();

	const results = useMessageSearch(messages, messageSearchValue);

	const handleClose = () => {
		setMessageSearchOpen(false);
		setMessageSearchValue("");
	};

	function formatDate(date) {
		const d = new Date(date);
		return d.toLocaleDateString([], {
			month: "short",
			day: "numeric",
		});
	}

	return (
		<Popover open={messageSearchOpen} onOpenChange={setMessageSearchOpen}>
			<PopoverTrigger asChild>
				<Button type="button" variant="ghost" size="icon">
					<Search className="h-5 w-5" />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align="end"
				className="w-80 p-0"
				onInteractOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
			>
				<div className="flex items-center gap-2 border-b p-2">
					<Input
						autoFocus
						value={messageSearchValue}
						onChange={(e) => setMessageSearchValue(e.target.value)}
						placeholder="Search messages..."
						className="h-9"
					/>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={handleClose}
					>
						<X className="h-5 w-5" />
					</Button>
				</div>

				<div className="max-h-80 overflow-y-auto p-2">
					{!messageSearchValue.trim() && (
						<p className="p-2 text-sm text-muted-foreground">
							Type to search messages
						</p>
					)}

					{messageSearchValue.trim() && results.length === 0 && (
						<p className="p-2 text-sm text-muted-foreground">
							No messages found
						</p>
					)}

					{results.map((message) => {
						return (
							<button
								key={message._id}
								type="button"
								onClick={() => scrollToMessage(message._id)}
								className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left hover:bg-muted"
							>
								<AvatarGenerator
									avatar={message?.senderId?.avatar}
									name={message?.senderId?.username}
									size="w-8 h-8"
								/>

								<div className="flex min-w-0 flex-1 flex-col">
									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<span className="font-medium text-foreground">
											{message?.senderId?.username || "Unknown"}
										</span>
										<span>•</span>
										<span>{formatDate(message.createdAt)}</span>
									</div>

									<p className="line-clamp-2 text-sm text-foreground">
										{message.content}
									</p>
								</div>
							</button>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default MessageSearchPopover;
