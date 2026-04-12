import { SheetContent } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import ProfileModal from "../profile/ProfileModal";
import SettingsModal from "../settings/SettingsModal";
import NewGroupModal from "../modals/NewGroupModal";
import AccountSheetHeader from "./AccountSheetHeader";
import AccountSheetFooter from "./AccountSheetFooter";
import ContactsModal from "../contacts/ContactsModal";
import LogoutBtn from "../buttons/LogoutBtn";

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
					<ProfileModal />
					<ContactsModal />
					<NewGroupModal />
					<SettingsModal />
					<LogoutBtn />
				</div>
				<Separator />
			</ScrollArea>

			<AccountSheetFooter />
		</SheetContent>
	);
}

export default AccountSheetContent;
