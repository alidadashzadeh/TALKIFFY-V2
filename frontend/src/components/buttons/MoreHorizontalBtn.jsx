import { forwardRef } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";

const MoreHorizontalBtn = forwardRef((props, ref) => {
	return (
		<Button
			ref={ref}
			variant="ghost"
			size="icon"
			className="h-8 w-8 shrink-0 rounded-full"
			{...props}
		>
			<MoreHorizontal className="h-4 w-4" />
		</Button>
	);
});

MoreHorizontalBtn.displayName = "MoreHorizontalBtn";

export default MoreHorizontalBtn;
