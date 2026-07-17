export function StatsSection() {
	return (
		<section className="py-20 bg-primary text-primary-content">
			<div className="container mx-auto px-4 md:px-6">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-primary-content/20">
					<div className="flex flex-col items-center justify-center p-4">
						<span className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">4</span>
						<span className="text-primary-content/80 font-medium">Modul Pembelajaran</span>
					</div>
					<div className="flex flex-col items-center justify-center p-4">
						<span className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">8</span>
						<span className="text-primary-content/80 font-medium">Tipe Kuis Interaktif</span>
					</div>
					<div className="flex flex-col items-center justify-center p-4">
						<span className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">1</span>
						<span className="text-primary-content/80 font-medium">Global Leaderboard</span>
					</div>
					<div className="flex flex-col items-center justify-center p-4">
						<span className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">∞</span>
						<span className="text-primary-content/80 font-medium">Peluang Belajar</span>
					</div>
				</div>
			</div>
		</section>
	);
}
