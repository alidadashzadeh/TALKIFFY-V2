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

			setIsNearBottom((prev) => {
				if (prev !== near) {
					// console.log("isNearBottom changed:", near);
					return near;
				}
				return prev;
			});
		};

		container.addEventListener("scroll", measure);

		// initial check
		measure();

		return () => {
			container.removeEventListener("scroll", measure);
		};
	}, [containerRef, threshold]);

	return isNearBottom;
}

export default useNearBottom;
