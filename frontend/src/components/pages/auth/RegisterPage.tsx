import RegisterForm from "../../form/RegisterForm";
import RegisterIllustration from "@/public/Sign up-bro.svg?react";
import LogoComponents from "@/public/NetQuest4.svg?react";

export default function RegisterPage() {
	return (
		<div className="flex flex-col lg:flex-row-reverse w-full bg-base-200/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.2)] rounded-[2rem] md:rounded-[3rem] overflow-hidden relative max-h-full">
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary opacity-50" />

			{/* Sisi Kanan: Ilustrasi */}
			<div className="hidden md:flex flex-1 flex-col items-center justify-center p-6 lg:p-10 bg-gradient-to-bl from-secondary/5 to-transparent relative overflow-hidden border-b lg:border-b-0 lg:border-l border-white/5">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/20 rounded-full blur-[60px]" />
				<RegisterIllustration className="w-60 lg:w-72 h-fit relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-transform hover:scale-105 duration-500 hover:-translate-y-2" />
				<div className="relative z-10 mt-8 text-center">
					<h3 className="text-xl lg:text-2xl font-black text-base-content tracking-tight">
						Kadet Baru{" "}
						<span className="text-secondary">NetQuest</span>
					</h3>
					<p className="text-base-content/60 mt-1.5 text-sm font-medium max-w-xs mx-auto">
						Persiapkan dirimu untuk menjelajahi dunia jaringan
						komputer.
					</p>
				</div>
			</div>

			{/* Sisi Kiri: Form Register */}
			<div className="flex-1 flex flex-col justify-center p-6 sm:p-10 lg:p-12 relative z-10 bg-base-100/50 overflow-y-hidden">
				<div className="w-full max-w-sm mx-auto space-y-5 lg:space-y-6">
					{/* Logo Pengganti Navbar */}
					<div className="flex justify-center lg:justify-start mb-2">
						<LogoComponents className="w-32 sm:w-40 h-fit drop-shadow-md" />
					</div>

					<div className="text-center lg:text-left">
						<h2 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm">
							Daftar Akun 🚀
						</h2>
						<p className="text-base-content/60 mt-1.5 text-sm font-medium">
							Buat identitas pemain barumu untuk memulai.
						</p>
					</div>

					<RegisterForm />
				</div>
			</div>
		</div>
	);
}
