import { useEffect, useState } from "react";

function useAttachmentImage({ attachment, onLoad }) {
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

		img.onload = () => setDisplayUrl(remoteUrl);
		img.onerror = () => setDisplayUrl(localUrl);
	}, [localUrl, remoteUrl]);

	const handleLoad = () => {
		onLoad?.();
	};

	return {
		displayUrl,
		handleLoad,
	};
}

export default useAttachmentImage;
