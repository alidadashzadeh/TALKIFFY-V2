import { useEffect, useRef } from "react";
import useGetMessages from "@/hooks/messages/useGetMessages";
import { ScrollArea } from "../ui/scroll-area";
import { formatSectionDate } from "@/lib/utils";
import { Muted } from "../ui/typography";
import { getAttachmentsByDate } from "@/lib/utils/conversation";

function SharedFiles() {
	const { messages = [], loading } = useGetMessages();
	const bottomRef = useRef(null);

	const attachmentsByDate = getAttachmentsByDate({ messages });

	const sortedDates = Object.keys(attachmentsByDate).sort(
		(a, b) => new Date(a) - new Date(b),
	);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
	}, [messages.length]);

	if (loading) {
		return (
			<div className="p-4 text-sm text-muted-foreground">Loading files...</div>
		);
	}

	if (!sortedDates.length) {
		return (
			<Muted className="p-4 text-center text-sm">No shared files yet.</Muted>
		);
	}

	return (
		<ScrollArea className="h-[60vh]">
			<div className="space-y-6 p-4">
				{sortedDates.map((dateKey) => (
					<div key={dateKey} className="space-y-3">
						<div className="sticky top-0 z-10 mx-auto w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
							{formatSectionDate(dateKey)}
						</div>

						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
							{attachmentsByDate[dateKey].map((attachment) => {
								const isImage =
									attachment?.type === "image" ||
									attachment?.type?.startsWith("image/");

								return (
									<div
										key={attachment._id || attachment.fallbackKey}
										className="overflow-hidden rounded-xl border bg-background"
									>
										{isImage ? (
											<img
												src={attachment.url}
												alt={attachment.fileName || "attachment"}
												className="aspect-square h-full w-full object-cover"
											/>
										) : (
											<div className="flex aspect-square items-center justify-center p-3">
												<div className="w-full space-y-2 text-center">
													<p className="truncate text-sm font-medium">
														{attachment?.fileName || "File"}
													</p>
													<p className="truncate text-xs text-muted-foreground">
														{attachment?.type || "attachment"}
													</p>
												</div>
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				))}

				<div ref={bottomRef} />
			</div>
		</ScrollArea>
	);
}

export default SharedFiles;
