// hooks/useNearBottom.js
import { useEffect, useState } from "react";

function useNearBottom(containerRef, threshold = 200) {
	const [isNearBottom, setIsNearBottom] = useState(true);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const measure = () => {
			const distanceFromBottom =
				container.scrollHeight - container.scrollTop - container.clientHeight;

			const near = distanceFromBottom <= threshold;

			setIsNearBottom(near);
		};

		container.addEventListener("scroll", measure);

		// initial check
		measure();

		return () => {
			container.removeEventListener("scroll", measure);
		};
	}, [containerRef.current, threshold]);

	return isNearBottom;
}

export default useNearBottom;
