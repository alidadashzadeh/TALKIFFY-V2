import { Sheet } from "@/components/ui/sheet";
import AccountSheetTrigger from "./AccountSheetTrigger";
import AccountSheetContent from "./AccountSheetContent";

function AccountSheet() {
	return (
		<Sheet key="left">
			<AccountSheetTrigger />
			<AccountSheetContent />
		</Sheet>
	);
}

export default AccountSheet;
