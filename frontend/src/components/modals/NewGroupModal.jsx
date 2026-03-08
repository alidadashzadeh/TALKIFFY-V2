import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCreateGroupConversation from "@/hooks/conversation/useCreateGroupConversation";

function NewGroupModal() {
	const {
		open,
		name,
		error,
		loading,
		setName,
		handleOpenChange,
		handleCreateGroup,
	} = useCreateGroupConversation();

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant="ghost" className="w-full justify-start">
					<Users className="h-4 w-4" />
					New Group
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-sm">
				<form onSubmit={handleCreateGroup}>
					<DialogHeader>
						<DialogTitle>Create new group</DialogTitle>
						<DialogDescription>
							Create the group first. You can add participants later.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="group-name">Group name</Label>
							<Input
								id="group-name"
								placeholder="Enter group name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								autoFocus
							/>
						</div>

						{error ? <p className="text-sm text-red-500">{error}</p> : null}
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline" disabled={loading}>
								Cancel
							</Button>
						</DialogClose>

						<Button type="submit" disabled={loading || !name.trim()}>
							{loading ? "Creating..." : "Create Group"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default NewGroupModal;
