import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function LandingNav() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
				scrolled
					? "bg-base-100/80 backdrop-blur-lg border-base-200 shadow-sm py-3"
					: "bg-transparent border-transparent py-5"
			}`}
		>
			<div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
						<span className="text-primary font-black text-xl font-oxanium">N</span>
					</div>
					<span className="text-xl md:text-2xl font-black tracking-tighter uppercase font-oxanium">
						<span className="text-primary">Net</span>
						<span className="text-base-content">Quest</span>
					</span>
				</div>
				
				<div className="flex items-center gap-4">
					<ThemeToggle />
					<div className="hidden md:flex items-center gap-2">
						<Link to="/auth/login" className="btn btn-ghost font-bold">
							Masuk
						</Link>
						<Link to="/auth/register" className="btn btn-primary font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
							Daftar Gratis
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
