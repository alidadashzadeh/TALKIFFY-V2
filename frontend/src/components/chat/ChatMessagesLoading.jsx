import { Skeleton } from "@/components/ui/skeleton";

function ChatMessagesLoading() {
	return (
		<div className="flex h-full flex-col justify-end gap-4 px-4 py-6">
			{Array.from({ length: 6 }).map((_, i) => {
				const isRight = i % 2 === 0;

				return (
					<div
						key={i}
						className={`flex items-end gap-2 px-16 ${
							isRight ? "justify-end" : "justify-start"
						}`}
					>
						{!isRight && <Skeleton className="h-10 w-10 rounded-full" />}

						<Skeleton className="h-16 w-96 rounded-2xl" />

						{isRight && <Skeleton className="h-10 w-10 rounded-full" />}
					</div>
				);
			})}
		</div>
	);
}

export default ChatMessagesLoading;
