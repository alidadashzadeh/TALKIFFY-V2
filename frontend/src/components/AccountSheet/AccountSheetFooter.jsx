import Logo from "../Logo";
import { DarkModeSwitch } from "../DarkModeSwitch";
import { SheetFooter } from "../ui/sheet";
import { H2, Small } from "../ui/typography";

function AccountSheetFooter() {
	return (
		<SheetFooter className="p-4 w-full ">
			<div className="flex gap-4 mr-auto  justify-between">
				<div className="grid h-12 aspect-square ">
					<Logo size={18} />
				</div>
				<div className="leading-tight">
					<H2 className="text-base">Talkiffy</H2>
					<Small className="text-xs text-muted-foreground">
						Talk, but clean.
					</Small>
				</div>
			</div>
			<DarkModeSwitch />
		</SheetFooter>
	);
}

export default AccountSheetFooter;
