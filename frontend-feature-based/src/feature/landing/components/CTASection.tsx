import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CTASection() {
	return (
		<section className="py-24 bg-base-100">
			<div className="container mx-auto px-4 md:px-6">
				<div className="bg-gradient-to-br from-base-200 to-base-300 rounded-[3rem] p-8 md:p-16 text-center max-w-5xl mx-auto border border-base-300 shadow-2xl relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
						<div className="absolute -top-24 -right-24 w-64 h-64 bg-primary rounded-full blur-[100px]" />
						<div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary rounded-full blur-[100px]" />
					</div>
					
					<div className="relative z-10">
						<h2 className="text-3xl md:text-5xl font-black mb-6">
							Siap Memulai Petualanganmu?
						</h2>
						<p className="text-lg md:text-xl text-base-content/70 mb-10 max-w-2xl mx-auto">
							Bergabunglah sekarang dan rasakan cara baru mempelajari jaringan komputer. Gratis.
						</p>
						<Link to="/auth/register" className="btn btn-primary btn-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform group rounded-full px-10">
							Daftar Sekarang
							<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
