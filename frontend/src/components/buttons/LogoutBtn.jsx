import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import useLogout from "@/hooks/auth/useLogout";

function LogoutBtn() {
	const { logout } = useLogout();

	return (
		<Button
			variant="ghost"
			className="w-full justify-start gap-2"
			onClick={logout}
		>
			<LogOut className="h-4 w-4" />
			<span>Logout</span>
		</Button>
	);
}

export default LogoutBtn;
