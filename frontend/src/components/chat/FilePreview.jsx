import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useMessagesContext } from "@/contexts/MessagesContext";

function FilePreview() {
	const { file, previewUrl, setFile } = useMessagesContext();

	if (!file) return null;

	const isImage = file.type.startsWith("image/");
	const isVideo = file.type.startsWith("video/");

	return (
		<div className="mb-2 rounded-2xl border bg-background p-3">
			<div className="relative">
				<Button
					type="button"
					size="icon"
					variant="secondary"
					onClick={() => setFile(null)}
					className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full"
				>
					<X className="h-4 w-4" />
				</Button>

				<div className="pr-10">
					{isImage && (
						<img
							src={previewUrl}
							alt={file.name}
							className="max-h-32 w-auto rounded-xl object-cover"
						/>
					)}

					{isVideo && (
						<video
							src={previewUrl}
							controls
							className="max-h-64 w-auto rounded-xl"
						/>
					)}

					{!isImage && !isVideo && (
						<div className="text-sm text-muted-foreground">{file.name}</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default FilePreview;
