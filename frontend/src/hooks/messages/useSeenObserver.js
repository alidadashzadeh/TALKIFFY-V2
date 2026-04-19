import { useEffect, useRef } from "react";

function useSeenObserver({ message, shouldTrackSeen, onSeen, observerRoot }) {
	const bubbleRef = useRef(null);

	useEffect(() => {
		if (!shouldTrackSeen) return;
		if (!bubbleRef.current) return;

		const node = bubbleRef.current;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];

				if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
					onSeen?.(message);
					observer.unobserve(node);
				}
			},
			{
				root: observerRoot,
				threshold: [0.6],
			},
		);

		observer.observe(node);

		return () => {
			observer.disconnect();
		};
	}, [message, onSeen, observerRoot, shouldTrackSeen]);

	return {
		bubbleRef,
	};
}

export default useSeenObserver;
