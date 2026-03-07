import { Contact, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useContactContext } from "@/contexts/ContactContext";
import AddContactModal from "./AddContactModal";
import ContactsList from "./ContactsList";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";

function ContactsModal() {
	const { contactModalOpen, setContactModalOpen } = useSheetModalContext();
	const { filteredBy, setFilteredBy } = useContactContext();

	return (
		<Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" className="flex justify-start">
					<Contact className="h-4 w-4" />
					Contacts
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Your contacts</DialogTitle>
					<DialogDescription>
						Search your contacts or add a new one.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<div className="relative flex-1">
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={filteredBy}
								onChange={(e) => setFilteredBy(e.target.value)}
								placeholder="Search contacts"
								className="pl-9"
							/>
						</div>

						<AddContactModal />
					</div>

					<div className="h-[350px] overflow-hidden rounded-xl ">
						<ContactsList />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default ContactsModal;
