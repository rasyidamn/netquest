import { useEffect, useState } from "react";

export function ReadingProgress() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		function handleScroll() {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;

			if (docHeight > 0) {
				const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
				setProgress(scrollPercent);
			}
		}

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="fixed top-0 left-0 z-50 h-1 w-full bg-base-200">
			<div
				className="h-full bg-primary transition-[width] duration-200 ease-out"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}