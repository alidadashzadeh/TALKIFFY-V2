import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "../ui/button";
import { useMessagesContext } from "@/contexts/MessagesContext";

function FilePreview() {
	const { file, previewUrl, setFile } = useMessagesContext();
	const [imageLoaded, setImageLoaded] = useState(false);

	if (!file || !file.type.startsWith("image/")) return null;

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
					{!imageLoaded && <div className="h-32 w-32 rounded-xl bg-muted" />}

					<img
						src={previewUrl}
						alt=""
						onLoad={() => setImageLoaded(true)}
						className={`max-h-32 w-auto rounded-xl object-cover ${
							imageLoaded ? "block" : "hidden"
						}`}
					/>
				</div>
			</div>
		</div>
	);
}

export default FilePreview;
