import { useEffect, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAddNewContact from "@/hooks/useAddNewContact";

function AddContactForm({ onSuccess }) {
	const [email, setEmail] = useState("");

	const { loading, addNewContact, isContactAdded, setIsContactAdded } =
		useAddNewContact();

	useEffect(() => {
		if (isContactAdded) {
			setEmail("");
			onSuccess?.();
			setIsContactAdded(false);
		}
	}, [isContactAdded, onSuccess, setIsContactAdded]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email.trim()) return;

		await addNewContact({ email });
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3">
			<Input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Enter email"
				disabled={loading}
				autoComplete="off"
			/>

			<Button
				type="submit"
				disabled={loading || !email.trim()}
				className="gap-2"
			>
				{loading ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<UserPlus className="h-4 w-4" />
				)}
				Add contact
			</Button>
		</form>
	);
}

export default AddContactForm;
