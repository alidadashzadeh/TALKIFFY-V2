import { useEffect, useState } from "react";

function MessageAttachmentImage({ attachment }) {
	const localUrl = attachment?.localUrl;
	const remoteUrl = attachment?.url;

	const [displayUrl, setDisplayUrl] = useState(localUrl || remoteUrl || "");

	useEffect(() => {
		if (!remoteUrl) {
			setDisplayUrl(localUrl || "");
			return;
		}

		if (!localUrl) {
			setDisplayUrl(remoteUrl);
			return;
		}

		setDisplayUrl(localUrl);

		const img = new Image();
		img.src = remoteUrl;

		img.onload = () => {
			setDisplayUrl(remoteUrl);
		};

		img.onerror = () => {
			setDisplayUrl(localUrl);
		};
	}, [localUrl, remoteUrl]);

	if (!displayUrl) return null;

	return (
		<img
			src={displayUrl}
			alt={attachment?.fileName || "attachment"}
			className="max-h-40 w-auto max-w-[220px] rounded-xl object-cover"
		/>
	);
}

export default MessageAttachmentImage;
