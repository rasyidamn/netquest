import { LandingNav } from "./LandingNav";
import { HeroSection } from "./HeroSection";
import { CpmkSection } from "./CpmkSection";
import { FeaturesSection } from "./FeaturesSection";
import { ModulesSection } from "./ModulesSection";
import { CTASection } from "./CTASection";

export function LandingPage() {
	return (
		<div className="min-h-screen bg-base-100 selection:bg-primary/30">
			<LandingNav />
			<main>
				<HeroSection />
				<CpmkSection />
				<FeaturesSection />
				<ModulesSection />
				
				<CTASection />
			</main>
			
			<footer className="py-10 bg-base-200 text-center border-t border-base-300">
				<div className="container mx-auto px-4">
					<p className="text-base-content/80 font-bold mb-2">
						Dikembangkan oleh Ilham Rasyidan Muhammad
					</p>
					<p className="text-base-content/60 text-sm">
						Sebuah Proyek Penelitian dan Pengembangan (RnD) Skripsi
					</p>
					<p className="text-base-content/40 text-xs mt-6">
						© {new Date().getFullYear()} NetQuest. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
