import { Button } from "@/components/ui/button";
import { SheetContent } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import ProfileModal from "../modals/ProfileModal";
import { LogOut } from "lucide-react";
import SettingsModal from "../modals/SettingsModal";
import NewGroupModal from "../modals/NewGroupModal";
import AccountSheetHeader from "./AccountSheetHeader";
import AccountSheetFooter from "./AccountSheetFooter";
import ContactsModal from "../modals/ContactsModal";

function AccountSheetContent() {
	return (
		<SheetContent
			side="left"
			className=" [&>button]:hidden flex h-dvh w-[320px] flex-col p-0 sm:w-[360px]"
		>
			<AccountSheetHeader />
			<Separator />

			<ScrollArea className="flex-1">
				<div className="grid gap-2 p-4">
					{/* If these render buttons inside, great.
                If they render triggers, they still align nicely in this stack. */}
					<ContactsModal />
					<NewGroupModal />
					<ProfileModal />
					<SettingsModal />

					<Button
						variant="ghost"
						className="w-full justify-start gap-2"
						onClick={() => {
							// TODO: wire logout handler
						}}
					>
						<LogOut className="h-4 w-4" />
						<span>Logout</span>
					</Button>
				</div>
				<Separator />
			</ScrollArea>

			<AccountSheetFooter />
		</SheetContent>
	);
}

export default AccountSheetContent;
