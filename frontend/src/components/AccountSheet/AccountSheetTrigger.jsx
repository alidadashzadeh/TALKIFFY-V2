import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { SheetTrigger } from "../ui/sheet";

function AccountSheetTrigger() {
	return (
		<SheetTrigger asChild>
			<Button variant="outline">
				<Menu />
			</Button>
		</SheetTrigger>
	);
}

export default AccountSheetTrigger;
