import { DarkModeSwitch } from "../ui/DarkModeSwitch";
import Logo from "../ui/Logo";
import { SheetFooter } from "../ui/sheet";
import { H2, Small } from "../ui/typography";

function AccountSheetFooter() {
	return (
		<SheetFooter className="flex flex-row items-center justify-between p-4">
			<div className="flex items-center gap-4 mr-auto">
				<div className="grid aspect-square h-12 place-items-center">
					<Logo size={18} />
				</div>

				<div className="leading-tight">
					<H2 className="text-base">Talkiffy</H2>

					<Small className="text-xs text-muted-foreground">
						chatting without the clutter.
					</Small>
				</div>
			</div>

			<DarkModeSwitch />
		</SheetFooter>
	);
}

export default AccountSheetFooter;
