import { motion } from "framer-motion";
import GroupInfoSidebar from "./ConversationInfoSidebar";

function ConversationSlidingPanel() {
	return (
		<motion.aside
			initial={{ width: 0, opacity: 0 }}
			animate={{ width: 360, opacity: 1 }}
			exit={{ width: 0, opacity: 0 }}
			transition={{ duration: 0.25, ease: "easeInOut" }}
			className="h-full shrink-0 overflow-hidden border-l bg-background"
		>
			<div className="h-full w-[360px]">
				<GroupInfoSidebar />
			</div>
		</motion.aside>
	);
}

export default ConversationSlidingPanel;
