import { useSheetModalContext } from "@/contexts/SheetModalProvider";
import { Button } from "./button";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

function SidePanelAction() {
	const { conversationInfoOpen, setConversationInfoOpen } =
		useSheetModalContext();
	return (
		<div>
			{conversationInfoOpen ? (
				<Button variant="ghost" onClick={() => setConversationInfoOpen(false)}>
					<PanelRightClose />
				</Button>
			) : (
				<Button variant="ghost" onClick={() => setConversationInfoOpen(true)}>
					<PanelRightOpen />
				</Button>
			)}
		</div>
	);
}

export default SidePanelAction;
