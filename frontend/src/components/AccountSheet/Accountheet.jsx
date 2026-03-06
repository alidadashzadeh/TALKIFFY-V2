import { Sheet } from "@/components/ui/sheet";
import AccountSheetTrigger from "./AccountSheetTrigger";
import AccountSheetContent from "./AccountSheetContent";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";

function AccountSheet() {
	const { accountSheetOpen, setAccountSheetOpen } = useSheetModalContext();

	return (
		<Sheet
			key="left"
			open={accountSheetOpen}
			onOpenChange={setAccountSheetOpen}
		>
			<AccountSheetTrigger />
			<AccountSheetContent />
		</Sheet>
	);
}

export default AccountSheet;
