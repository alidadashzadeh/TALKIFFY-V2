import { Mic, Send } from "lucide-react";
import { Button } from "../ui/button";
import { useMessagesContext } from "@/contexts/MessagesContext";

function SendMessageBtn({ loading }) {
	const { text, file } = useMessagesContext();
	const hasText = !!text?.trim();

	return (
		<div>
			{hasText || file ? (
				<Button
					type="submit"
					size="icon"
					className="h-11 w-11 shrink-0 rounded-full"
					disabled={loading}
				>
					<Send className="h-5 w-5" />
				</Button>
			) : (
				<Button
					type="button"
					size="icon"
					variant="ghost"
					className="h-11 w-11 shrink-0 rounded-full"
				>
					<Mic className="h-5 w-5 text-muted-foreground" />
				</Button>
			)}
		</div>
	);
}

export default SendMessageBtn;
