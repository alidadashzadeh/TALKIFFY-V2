import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useConversationContext } from "@/contexts/ConversationContext";
import { useSheetModalContext } from "@/contexts/SheetModalProvider";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AvatarGenerator from "@/components/AvatarGenerator";
import { Camera } from "lucide-react";
import { P } from "../ui/typography";
import { getConversationDisplayData } from "@/lib/utils";

function EditGroupInfoModal() {
	const { currentConversation } = useConversationContext();
	const { editGroupModalOpen, setEditGroupModalOpen } = useSheetModalContext();
	const { name, avatar } = getConversationDisplayData(currentConversation);
	const loading = false;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: "",
			avatar: "",
		},
	});

	useEffect(() => {
		if (editGroupModalOpen) {
			reset({
				name: currentConversation?.name || "",
				avatar: currentConversation?.avatar || "",
			});
		}
	}, [editGroupModalOpen, currentConversation, reset]);

	const onSubmit = async (data) => {
		console.log(data);
	};

	if (currentConversation?.type !== "group") return null;

	return (
		<Dialog open={editGroupModalOpen} onOpenChange={setEditGroupModalOpen}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Group Info</DialogTitle>
					<DialogDescription>
						Update the group name and avatar.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					<div className="relative flex flex-col gap-4 items-center justify-center py-4 ">
						<div>
							<AvatarGenerator avatar={avatar} name={name} size="w-24 h-24" />

							<div className=" relative">
								<Button
									type="button"
									size="icon"
									variant="secondary"
									className="absolute bottom-0 -right-4 rounded-full"
									disabled={false}
									asChild
								>
									<label className="cursor-pointer">
										<Camera className="h-4 w-4" />
										<input
											type="file"
											hidden
											accept="image/*"
											// onChange={handleImageUpload}
										/>
									</label>
								</Button>
							</div>
						</div>
						<P>{name}</P>
					</div>

					<div className="space-y-2">
						<Label htmlFor="name">Group Name</Label>
						<Input
							id="name"
							placeholder="Enter group name"
							{...register("name", {
								required: "Group name is required",
								validate: (v) =>
									v.trim().length > 0 || "Group name cannot be empty",
							})}
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name.message}</p>
						)}
					</div>

					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setEditGroupModalOpen(false)}
						>
							Cancel
						</Button>

						<Button type="submit" disabled={loading}>
							{loading ? "Saving..." : "Save"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default EditGroupInfoModal;
