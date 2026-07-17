import { BookOpen, Wifi, Server, Home } from "lucide-react";

export function ModulesSection() {
	const modules = [
		{
			id: 1,
			title: "Module 1: Communication in a Connected World",
			icon: <BookOpen className="w-6 h-6 text-primary" />,
			desc: "Pahami gambaran besar mengapa jaringan menjadi tulang punggung kehidupan modern dan dasar bagaimana perangkat saling berkomunikasi.",
		},
		{
			id: 2,
			title: "Module 2: Network Components, Types, and Connections",
			icon: <Server className="w-6 h-6 text-secondary" />,
			desc: "Kenali perangkat keras penyusun jaringan seperti router dan switch, serta pelajari perbedaan jenis jaringan mulai dari LAN hingga WAN.",
		},
		{
			id: 3,
			title: "Module 3: Wireless and Mobile Networks",
			icon: <Wifi className="w-6 h-6 text-accent" />,
			desc: "Bebaskan dirimu dari kabel! Temukan rahasia di balik sinyal Wi-Fi dan jaringan seluler yang membuatmu tetap terhubung di mana saja.",
		},
		{
			id: 4,
			title: "Module 4: Build a Home Network",
			icon: <Home className="w-6 h-6 text-success" />,
			desc: "Praktikkan pengetahuanmu dengan membangun dan mengonfigurasi jaringan rumah skala kecil secara aman dan efisien.",
		},
	];

	return (
		<section className="py-24 bg-base-100 relative overflow-hidden">
			{/* Decorative elements */}
			<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
			<div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

			<div className="container relative z-10 mx-auto px-4 md:px-6">
				<div className="text-center max-w-4xl mx-auto mb-16">
					<div className="inline-block px-4 py-1 rounded-full bg-base-200 border border-base-300 text-sm font-bold text-base-content/70 mb-4">
						Kurikulum Standar Industri
					</div>
					<h2 className="text-3xl md:text-5xl font-black mb-6">
						Materi Cisco Networking Academy
					</h2>
					<p className="text-lg text-base-content/70">
						Diadaptasi langsung dari <strong>Career Path Network Technician: Networking Basic</strong>. 
						Menguasai 4 modul pertama ini adalah langkah awal menuju sertifikasi profesional.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
					{modules.map((mod) => (
						<div 
							key={mod.id} 
							className="group flex gap-6 p-6 md:p-8 rounded-3xl bg-base-200 border border-base-300 hover:border-primary/30 transition-all hover:bg-base-100 hover:shadow-xl"
						>
							<div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-base-100 border border-base-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
								{mod.icon}
							</div>
							<div>
								<h3 className="text-xl font-bold mb-3 leading-tight">{mod.title}</h3>
								<p className="text-base-content/70 text-sm md:text-base leading-relaxed">
									{mod.desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
