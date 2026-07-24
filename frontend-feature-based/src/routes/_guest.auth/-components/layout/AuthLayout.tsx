import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
	children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
	return (
		// PERBAIKAN: Gunakan h-screen dan w-screen untuk mengunci ukuran
		<div className="relative h-screen w-screen bg-base-300 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
			<div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
			<div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary/15 blur-[150px] pointer-events-none" />

			{/* Tombol Kembali ke Homepage — pojok kiri atas */}
			<div className="absolute top-4 left-4 z-20">
				<Link
					to="/"
					className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-base-content/60 hover:text-base-content hover:bg-base-100/50 transition-all duration-200 group"
				>
					<ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
					<span className="hidden sm:inline">Beranda</span>
				</Link>
			</div>

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

