import { Skeleton } from "@/components/ui/skeleton";

function ConversationLoader({ count = 15 }) {
	return (
		<div className="flex flex-col gap-4">
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="flex items-center gap-4">
					<Skeleton className="h-12 w-12 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-[250px]" />
						<Skeleton className="h-4 w-[200px]" />
					</div>
				</div>
			))}
		</div>
	);
}

export default ConversationLoader;
