import type { ReactNode } from "react";

export const RootLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="min-h-screen bg-base-300 text-foreground font-oxanium">
			{children}
		</div>
	);
};
