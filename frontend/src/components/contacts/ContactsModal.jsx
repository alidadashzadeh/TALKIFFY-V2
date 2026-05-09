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
import StartPrivateChatBtn from "../buttons/StartPrivateChatBtn";

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

			<DialogContent className="w-[calc(100vw-2rem)] max-w-md border-muted sm:w-full">
				<DialogHeader>
					<DialogTitle>Your contacts</DialogTitle>
					<DialogDescription>
						Search your contacts or add a new one.
					</DialogDescription>
				</DialogHeader>

				<div className="flex min-w-0 flex-col gap-4">
					<div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
						<div className="relative w-full min-w-0 flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

							<Input
								value={filteredBy}
								onChange={(e) => setFilteredBy(e.target.value)}
								placeholder="Search contacts"
								className="w-full pl-9"
							/>
						</div>

						<div className="w-full sm:w-auto">
							<AddContactModal />
						</div>
					</div>

					<div className="h-[350px] min-w-0 overflow-hidden rounded-xl">
						<ContactsList ActionComponent={StartPrivateChatBtn} />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default ContactsModal;
