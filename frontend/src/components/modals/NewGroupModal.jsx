// import { useState } from "react";
// import { Users } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
// 	Dialog,
// 	DialogClose,
// 	DialogContent,
// 	DialogDescription,
// 	DialogFooter,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useSheetModalContext } from "@/contexts/SheetModalProvider";

// function NewGroupModal() {
// 	const { groupModalOpen, setGroupModalOpen } = useSheetModalContext();
// 	const [groupName, setGroupName] = useState("");
// 	const [loading, setLoading] = useState(false);

// 	const handleCreateGroup = async (e) => {
// 		e.preventDefault();

// 		if (!groupName.trim()) return;

// 		try {
// 			setLoading(true);

// 			// replace with your api call
// 			// await axios.post("/api/conversations/group", {
// 			// 	name: groupName.trim(),
// 			// });

// 			setGroupName("");
// 			setGroupModalOpen(false);
// 		} catch (error) {
// 			console.error("Create group error:", error);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<Dialog open={groupModalOpen} onOpenChange={setGroupModalOpen}>
// 			<DialogTrigger asChild>
// 				<Button variant="ghost" className="flex justify-start w-full">
// 					<Users className="mr-2 h-4 w-4" />
// 					New Group
// 				</Button>
// 			</DialogTrigger>

// 			<DialogContent className="sm:max-w-sm">
// 				<form onSubmit={handleCreateGroup}>
// 					<DialogHeader>
// 						<DialogTitle>Create new group</DialogTitle>
// 						<DialogDescription>
// 							Give your group a name. You can add members later.
// 						</DialogDescription>
// 					</DialogHeader>

// 					<div className="grid gap-4 py-4">
// 						<div className="grid gap-2">
// 							<Label htmlFor="groupName">Group name</Label>
// 							<Input
// 								id="groupName"
// 								placeholder="Enter group name"
// 								value={groupName}
// 								onChange={(e) => setGroupName(e.target.value)}
// 								autoFocus
// 							/>
// 						</div>
// 					</div>

// 					<DialogFooter>
// 						<DialogClose asChild>
// 							<Button type="button" variant="outline" disabled={loading}>
// 								Cancel
// 							</Button>
// 						</DialogClose>

// 						<Button type="submit" disabled={loading || !groupName.trim()}>
// 							{loading ? "Creating..." : "Create Group"}
// 						</Button>
// 					</DialogFooter>
// 				</form>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }

// export default NewGroupModal;

import { useState } from "react";
import { Users } from "lucide-react";

import { axiosInstance } from "@/lib/axios";
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
import toast from "react-hot-toast";

function NewGroupModal() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleCreateGroup = async (e) => {
		e.preventDefault();

		const trimmedName = name.trim();

		if (!trimmedName) {
			setError("Group name is required");
			return;
		}

		try {
			setLoading(true);
			setError("");

			const res = await axiosInstance.post("/conversations", {
				name: trimmedName,
			});

			console.log(res);
			toast.success("Group Created successfully");

			setName("");
			setOpen(false);
		} catch (err) {
			console.error("Create group error:", err);
			setError(err?.response?.data?.message || "Failed to create group");
		} finally {
			setLoading(false);
		}
	};

	const handleOpenChange = (value) => {
		setOpen(value);

		if (!value) {
			setName("");
			setError("");
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant="ghost" className="w-full justify-start">
					<Users className="mr-2 h-4 w-4" />
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
								onChange={(e) => {
									setName(e.target.value);
									if (error) setError("");
								}}
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
