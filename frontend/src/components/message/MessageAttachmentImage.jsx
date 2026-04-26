import { useConversationContext } from "@/contexts/ConversationContext";
import useNearBottom from "@/hooks/conversation/useNearBottom";
import useAttachmentImage from "@/hooks/messages/useAttachmentImage";

function MessageAttachmentImage({ attachment }) {
	const { bottomRef, containerRef } = useConversationContext();
	const isNearBottom = useNearBottom(containerRef);

	const handleScroll = () => {
		if (isNearBottom) {
			bottomRef.current?.scrollIntoView({
				behavior: "auto",
				block: "end",
			});
		}
	};

	const { displayUrl, handleLoad } = useAttachmentImage({
		attachment,
		onLoad: handleScroll,
	});

	if (!displayUrl) return null;

	return (
		<img
			src={displayUrl}
			alt={attachment?.fileName || "attachment"}
			className="max-h-40 w-auto max-w-[220px] rounded-xl object-cover"
			onLoad={handleLoad}
		/>
	);
}

export default MessageAttachmentImage;
