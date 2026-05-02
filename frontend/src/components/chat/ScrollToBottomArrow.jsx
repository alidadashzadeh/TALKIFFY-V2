import { useConversationContext } from "@/contexts/ConversationContext";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function ScrollToBottomArrow() {
	const { bottomRef } = useConversationContext();

	const handleScrollToBottom = () => {
		bottomRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: 24, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: 24, scale: 0.95 }}
				transition={{ duration: 0.18, ease: "easeOut" }}
				className="pointer-events-none absolute bottom-4 left-1/2 z-50 -translate-x-1/2"
			>
				<button
					type="button"
					onClick={handleScrollToBottom}
					className="  pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-lg transition hover:bg-muted"
				>
					<ChevronDown className="h-5  w-5 " />
				</button>
			</motion.div>
		</AnimatePresence>
	);
}

export default ScrollToBottomArrow;
