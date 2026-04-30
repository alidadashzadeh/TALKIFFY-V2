import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";

function MessageSearchPopover() {
	const {
		messageSearchOpen,
		setMessageSearchOpen,
		messageSearchValue,
		setMessageSearchValue,
	} = useSheetModalContext();

	const handleClose = () => {
		setMessageSearchOpen(false);
		setMessageSearchValue("");
	};

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

				<div className="p-3 text-sm text-muted-foreground">
					Search results will go here
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default MessageSearchPopover;
