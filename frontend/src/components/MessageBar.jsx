import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import useSendMessage from "../hooks/useSendMessage";

// eslint-disable-next-line react/prop-types
function MessageBar({ loading }) {
	const { register, handleSubmit, reset } = useForm();
	const { sendMessage } = useSendMessage();

	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const onSubmit = (data) => {
		sendMessage(data);
		reset();
		inputRef.current?.focus();
	};

	return (
		<div className="flex gap-2 px-4 my-2">
			<form
				className="flex gap-2 w-full items-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Input
					ref={inputRef}
					autoComplete="off"
					disabled={loading}
					placeholder="Send a message..."
					className="h-12 rounded-full pl-4"
					{...register("message", { required: "A message cannot be empty" })}
				/>

				<Button
					type="submit"
					disabled={loading}
					className="h-12 w-12 rounded-full p-0"
					aria-label="Send message"
				>
					<Send className="h-5 w-5" />
				</Button>
			</form>
		</div>
	);
}

export default MessageBar;
