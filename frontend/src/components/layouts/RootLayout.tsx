import type { ReactNode } from "react";
import { ErrorBoundary } from "../ErrorBoundary";

interface RootLayoutProps {
	children: ReactNode;
}
export default function RootLayout({children}: RootLayoutProps) {
	return (
		<ErrorBoundary>
			<div className="min-h-screen bg-base-300 text-foreground font-oxanium">
				{children}
			</div>
		</ErrorBoundary>
	);
}
