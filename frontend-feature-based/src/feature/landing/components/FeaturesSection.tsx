import { Zap, Heart, Trophy, Map } from "lucide-react";

export function FeaturesSection() {
	const features = [
		{
			icon: <Zap className="w-8 h-8 text-primary" />,
			title: "Sistem XP & Level",
			description: "Kumpulkan XP dari setiap kuis yang berhasil diselesaikan dan naikkan level karaktermu hingga mencapai pangkat tertinggi, GOAT.",
		},
		{
			icon: <Heart className="w-8 h-8 text-error" />,
			title: "Mekanisme Nyawa",
			description: "Hati-hati dalam menjawab! Jawaban salah akan mengurangi nyawa. Nyawa akan pulih setelah membaca kembali materi teori.",
		},
		{
			icon: <Trophy className="w-8 h-8 text-warning" />,
			title: "Leaderboard Realtime",
			description: "Bersainglah dengan mahasiswa lain. Buktikan bahwa kamu adalah yang terbaik dengan mengumpulkan XP terbanyak.",
		},
		{
			icon: <Map className="w-8 h-8 text-success" />,
			title: "Roadmap Belajar Visual",
			description: "Pantau progres belajarmu melalui antarmuka peta perjalanan (roadmap) interaktif yang menantang dan memotivasi.",
		},
	];

	return (
		<section className="py-24 bg-base-200">
			<div className="container mx-auto px-4 md:px-6">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-3xl md:text-5xl font-black mb-6">
						Belajar Jaringan Tanpa Bosan
					</h2>
					<p className="text-lg text-base-content/70">
						NetQuest menggabungkan kurikulum berstandar industri dengan elemen permainan (gamifikasi) untuk pengalaman belajar yang optimal.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<div 
							key={index} 
							className="bg-base-100 p-8 rounded-3xl border border-base-300 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 group hover:-translate-y-2"
						>
							<div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
								{feature.icon}
							</div>
							<h3 className="text-xl font-bold mb-3">{feature.title}</h3>
							<p className="text-base-content/70 leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
