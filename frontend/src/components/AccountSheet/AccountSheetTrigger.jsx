import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { SheetTrigger } from "../ui/sheet";

function AccountSheetTrigger() {
	return (
		<SheetTrigger asChild>
			<Button variant="outline" className="h-10 w-10">
				<Menu className="h-4 w-4 " />
			</Button>
		</SheetTrigger>
	);
}

export default AccountSheetTrigger;
