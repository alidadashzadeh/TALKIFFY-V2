import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useContactContext } from "../contexts/ContactContext";
import { useAuthContext } from "../contexts/AuthContext";
import useAddNewContact from "../hooks/useAddNewContact";

function AddContactModal() {
	const { openAddContactModal, setOpenAddContactModal } = useContactContext();
	const { currentUser } = useAuthContext();
	const { loading, addNewContact, isContactAdded } = useAddNewContact();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	useEffect(() => {
		if (isContactAdded) {
			reset();
			setOpenAddContactModal(false);
		}
	}, [isContactAdded, setOpenAddContactModal, reset]);

	const close = () => {
		reset();
		setOpenAddContactModal(false);
	};

	const onSubmit = async (data) => {
		if (data.email === currentUser.email)
			return toast.error("Wrong User selected!");
		addNewContact(data);
	};

	return (
		<Dialog
			open={openAddContactModal}
			onOpenChange={(open) => !open && close()}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add new Contact</DialogTitle>
				</DialogHeader>
				content
				<form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="name@example.com"
							disabled={loading}
							aria-invalid={!!errors.email}
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: "Please enter a valid email address",
								},
							})}
						/>
						{errors?.email?.message && (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						)}
					</div>

					<div className="flex justify-end">
						<Button type="submit" disabled={loading}>
							{loading ? "Adding Contact..." : "Add contact"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default AddContactModal;
