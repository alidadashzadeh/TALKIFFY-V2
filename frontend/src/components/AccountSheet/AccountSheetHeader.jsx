import { SheetHeader, SheetTitle } from "../ui/sheet";
import AvatarGenerator from "../AvatarGenerator";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import { truncateText } from "@/lib/utils";

function AccountSheetHeader() {
	const { currentUser } = useCurrentUser();

	const shortName =
		currentUser?.username.length < 16
			? currentUser?.username
			: currentUser?.username.slice(0, 16) + "...";

	return (
		<SheetHeader className="p-4 pb-3 ">
			<SheetTitle className="flex items-center gap-3">
				<AvatarGenerator
					avatar={currentUser?.avatar}
					name={currentUser?.username}
				/>

				<div className="min-w-0 leading-tight">
					<p className="text-sm font-semibold">{truncateText(shortName, 20)}</p>
					<p className=" text-xs text-muted-foreground">
						{truncateText(currentUser?.email || " ", 35)}
					</p>
				</div>
			</SheetTitle>
		</SheetHeader>
	);
}

export default AccountSheetHeader;
