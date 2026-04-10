import { Button } from "@/components/ui/button";
import { SheetContent } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import ProfileModal from "../profile/ProfileModal";
import { LogOut } from "lucide-react";
import SettingsModal from "../settings/SettingsModal";
import NewGroupModal from "../modals/NewGroupModal";
import AccountSheetHeader from "./AccountSheetHeader";
import AccountSheetFooter from "./AccountSheetFooter";
import ContactsModal from "../contacts/ContactsModal";
import useLogout from "@/hooks/auth/useLogout";

function AccountSheetContent() {
	const { logout } = useLogout();

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

					<Button
						variant="ghost"
						className="w-full justify-start gap-2"
						onClick={logout}
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
