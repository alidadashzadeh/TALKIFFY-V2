import { useEffect, useRef } from "react";
import useGetMessages from "@/hooks/messages/useGetMessages";
import { ScrollArea } from "../ui/scroll-area";
import { formatSectionDate } from "@/lib/utils";
import { Muted } from "../ui/typography";
import { getAttachmentsByDate } from "@/lib/utils/conversation";
import { Spinner } from "../ui/spinner";

function SharedImages() {
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
			<div className="p-4 text-sm text-muted-foreground flex justify-center items-center">
				<Spinner />
				<span className="px-4">Loading Images...</span>
			</div>
		);
	}

	if (!sortedDates.length) {
		return (
			<Muted className="p-4 text-center text-sm">No shared files yet.</Muted>
		);
	}

	return (
		<ScrollArea className="h-full">
			<div className="space-y-6 p-4">
				{sortedDates.map((dateKey) => (
					<div key={dateKey} className="space-y-3">
						<div className="sticky top-0 z-10 mx-auto w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
							{formatSectionDate(dateKey)}
						</div>

						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
							{attachmentsByDate[dateKey].map((attachment) => {
								return (
									<div
										key={attachment._id || attachment.fallbackKey}
										className="overflow-hidden rounded-xl border bg-background"
									>
										<img
											src={attachment.url}
											alt={attachment.fileName || "attachment"}
											className="aspect-square h-full w-full object-cover"
										/>
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

export default SharedImages;
