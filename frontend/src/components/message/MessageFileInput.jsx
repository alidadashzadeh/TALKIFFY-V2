import { Paperclip } from "lucide-react";
import { useRef } from "react";
import { useMessagesContext } from "@/contexts/MessagesContext";
import { Button } from "../ui/button";

function MessageFileInput() {
	const inputRef = useRef(null);
	const { setFile } = useMessagesContext();

	return (
		<>
			<input
				ref={inputRef}
				type="file"
				className="hidden"
				onChange={(e) => {
					const selectedFile = e.target.files?.[0];
					if (!selectedFile) return;

					setFile(selectedFile);
				}}
				accept="image/*"
			/>

			<Button
				type="button"
				size="icon"
				variant="ghost"
				onClick={() => inputRef.current?.click()}
			>
				<Paperclip className="h-5 w-5 text-muted-foreground" />
			</Button>
		</>
	);
}

export default MessageFileInput;
