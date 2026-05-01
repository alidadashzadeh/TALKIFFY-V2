import { Send } from "lucide-react";
import { Button } from "../ui/button";

function SendMessageBtn() {
	return (
		<Button
			type="submit"
			size="icon"
			className="h-11 w-11 shrink-0 rounded-full"
		>
			<Send className="h-5 w-5" />
		</Button>
	);
}

export default SendMessageBtn;
