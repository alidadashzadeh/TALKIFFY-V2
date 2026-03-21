import { useEffect, useMemo, useRef } from "react";
import useGetMessages from "@/hooks/messages/useGetMessages";
import { ScrollArea } from "../ui/scroll-area";
import { formatDateKey, formatSectionDate } from "@/lib/utils";
import { Muted } from "../ui/typography";

function SharedFiles() {
	const { data: messages = [], isLoading } = useGetMessages();
	const bottomRef = useRef(null);

	const attachmentsByDate = useMemo(() => {
		return messages.reduce((acc, message) => {
			if (!message?.attachments?.length) return acc;

			const dateKey = formatDateKey(message.createdAt);

			if (!acc[dateKey]) {
				acc[dateKey] = [];
			}

			message.attachments.forEach((attachment, index) => {
				acc[dateKey].push({
					...attachment,
					messageId: message._id,
					createdAt: message.createdAt,
					fallbackKey: `${message._id}-${attachment._id || index}`,
				});
			});

			return acc;
		}, {});
	}, [messages]);

	const sortedDates = useMemo(() => {
		return Object.keys(attachmentsByDate).sort(
			(a, b) => new Date(a) - new Date(b),
		);
	}, [attachmentsByDate]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({
			behavior: "auto",
			block: "end",
		});
	}, [sortedDates.length, messages.length]);

	if (isLoading) {
		return (
			<div className="p-4 text-sm text-muted-foreground">Loading files...</div>
		);
	}

	if (!sortedDates.length) {
		return (
			<Muted className="p-4 text-sm text-center">No shared files yet.</Muted>
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
							{attachmentsByDate[dateKey].map((attachment) => (
								<div
									key={attachment._id || attachment.fallbackKey}
									className="overflow-hidden rounded-xl border bg-background"
								>
									{attachment?.type === "image" ? (
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
							))}
						</div>
					</div>
				))}

				<div ref={bottomRef} />
			</div>
		</ScrollArea>
	);
}

export default SharedFiles;
