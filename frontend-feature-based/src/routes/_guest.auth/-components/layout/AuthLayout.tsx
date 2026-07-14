import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AuthLayoutProps {
	children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
	return (
		// PERBAIKAN: Gunakan h-screen dan w-screen untuk mengunci ukuran
		<div className="relative h-screen w-screen bg-base-300 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
			<div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
			<div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/15 blur-[150px] pointer-events-none" />

			{/* Theme Toggle — pojok kanan atas */}
			<div className="absolute top-4 right-4 z-20">
				<ThemeToggle />
			</div>

			{/* PERBAIKAN: max-h-full akan memaksa kartu menyesuaikan diri dengan sisa ruang */}
			<main className="relative z-10 w-full max-w-5xl max-h-full flex justify-center">
				{children}
			</main>
		</div>
	);
}

