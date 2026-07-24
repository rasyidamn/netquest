import { Target, Network, ShieldCheck } from "lucide-react";

export function CpmkSection() {
	const cpmkList = [
		{
			icon: <Target className="w-10 h-10 text-primary" />,
			title: "CPMK 1: Fondasi Komunikasi Data & Infrastruktur",
			description:
				"Mahasiswa mampu menganalisis prinsip dasar transmisi data (bandwidth & throughput) dan mengidentifikasi komponen keras penyusun jaringan komputer (Client, Server, Router, Switch).",
			reference: "Mengacu ke Chapter 1 & 2",
		},
		{
			icon: <Network className="w-10 h-10 text-secondary" />,
			title: "CPMK 2: Arsitektur Jaringan Tanpa Kabel",
			description:
				"Mahasiswa mampu mengklasifikasikan berbagai teknologi transmisi data dan mengevaluasi karakteristik jaringan nirkabel (Wi-Fi) serta konektivitas seluler modern.",
			reference: "Mengacu ke Chapter 3 & 4.1 - 4.3",
		},
		{
			icon: <ShieldCheck className="w-10 h-10 text-accent" />,
			title: "CPMK 3: Implementasi & Keamanan Jaringan (SOHO)",
			description:
				"Mahasiswa mampu merancang, mengonfigurasi, dan mengamankan infrastruktur jaringan skala rumah atau kantor kecil (Small Office Home Office) menggunakan simulasi perangkat router nirkabel.",
			reference: "Mengacu ke Chapter 4.4",
		},
	];

	return (
		<section className="py-24 relative bg-base-100 overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-transparent to-base-200/50 pointer-events-none" />
			<div className="container mx-auto px-4 md:px-6 relative z-10">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-3xl md:text-5xl font-black mb-6">
						Capaian Pembelajaran
					</h2>
					<p className="text-lg text-base-content/70">
						Tiga tujuan kompetensi utama yang akan Anda kuasai setelah menyelesaikan seluruh misi di NetQuest.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{cpmkList.map((cpmk, index) => (
						<div
							key={index}
							className="group relative bg-base-200/50 backdrop-blur-sm p-8 rounded-3xl border border-white/5 shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-500 overflow-hidden"
						>
							{/* Background glow on hover */}
							<div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none" />
							
							<div className="relative z-10 flex flex-col h-full">
								<div className="w-20 h-20 rounded-2xl bg-base-100 shadow-inner flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
									{cpmk.icon}
								</div>
								
								<h3 className="text-2xl font-bold leading-snug mb-4 group-hover:text-primary transition-colors">
									{cpmk.title}
								</h3>
								
								<p className="text-base-content/70 leading-relaxed mb-6 flex-grow">
									{cpmk.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
