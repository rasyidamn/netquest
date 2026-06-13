
import type { ReactNode } from "react";
import NavBar from "../NavBar";

interface AuthLayoutProps {
	children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="relative min-h-screen bg-background">
			<NavBar role="auth" className="fixed top-0 left-0 right-0 z-50" />
			<main className="flex min-h-screen items-center justify-center p-4 pt-20">
				{children}
			</main>
		</div>
	);
}
