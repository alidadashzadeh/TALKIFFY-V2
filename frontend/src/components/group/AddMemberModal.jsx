import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import ContactsList from "../contacts/ContactsList";
import { useContactContext } from "@/contexts/ContactContext";
import AddMemberBtn from "../buttons/AddMemberBtn";

function AddMemberModal() {
	const { addMemberModalOpen, setAddMemberModalOpen } = useSheetModalContext();
	const { filteredBy, setFilteredBy } = useContactContext();

	return (
		<Dialog open={addMemberModalOpen} onOpenChange={setAddMemberModalOpen}>
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
					</div>

					<div className="h-[350px] overflow-hidden rounded-xl ">
						<ContactsList ActionComponent={AddMemberBtn} />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default AddMemberModal;
