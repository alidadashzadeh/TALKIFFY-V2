import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import AddContactForm from "./AddContactForm";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";

function AddContactModal() {
	const { addContactModalOpen, setAddContactModalOpen } =
		useSheetModalContext();

	return (
		<Dialog open={addContactModalOpen} onOpenChange={setAddContactModalOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<UserPlus className="h-4 w-4" />
					Add Contact
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Add new contact</DialogTitle>
					<DialogDescription>
						Enter the user&apos;s email address to add them to your contacts.
					</DialogDescription>
				</DialogHeader>

				<AddContactForm onSuccess={() => setAddContactModalOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

export default AddContactModal;
