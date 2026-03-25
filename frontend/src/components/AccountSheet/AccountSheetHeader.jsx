import { SheetHeader, SheetTitle } from "../ui/sheet";
import AvatarGenerator from "../AvatarGenerator";
import useCurrentUser from "@/hooks/user/useCurrentUser";

function AccountSheetHeader() {
	const { data: currentUser } = useCurrentUser();

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
					<p className="truncate text-sm font-semibold">{shortName}</p>
					<p className="truncate text-xs text-muted-foreground">
						{currentUser?.email || " "}
					</p>
				</div>
			</SheetTitle>
		</SheetHeader>
	);
}

export default AccountSheetHeader;
