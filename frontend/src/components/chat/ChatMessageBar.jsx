import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import useSendMessage from "@/hooks/useSendMessage";

// eslint-disable-next-line react/prop-types
function ChatMessageBar({ loading }) {
	const { register, handleSubmit, reset } = useForm({
		defaultValues: {
			message: "",
		},
	});
	const { sendMessage } = useSendMessage();

	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const onSubmit = (data) => {
		const trimmedMessage = data.message?.trim();

		if (!trimmedMessage) return;

		sendMessage({ message: trimmedMessage });
		reset();
		inputRef.current?.focus();
	};

	return (
		<div className="w-full">
			<form
				className="flex w-full items-center gap-2 rounded-2xl border bg-background p-2 shadow-sm"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Input
					ref={inputRef}
					autoComplete="off"
					disabled={loading}
					placeholder="Type a message..."
					className="h-11 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
					{...register("message", {
						validate: (value) =>
							value.trim().length > 0 || "A message cannot be empty",
					})}
				/>

				<Button
					type="submit"
					disabled={loading}
					size="icon"
					className="h-11 w-11 shrink-0 rounded-full"
					aria-label="Send message"
				>
					<Send className="h-5 w-5" />
				</Button>
			</form>
		</div>
	);
}

export default ChatMessageBar;
