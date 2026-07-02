import LoginIllustration from "@/public/auth/login-animate.svg?react";
import LogoComponents from "@/public/netquest-logo.svg?react";
import { LoginForm } from "../form/LoginForm";


export default function LoginPage() {
	return (
		// max-h-[95vh] mencegah kartu lebih tinggi dari layar
		<div className="flex flex-col lg:flex-row w-full bg-base-200/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.2)] rounded-4xl md:rounded-[3rem] overflow-hidden relative max-h-full">
			<div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-secondary to-primary opacity-50" />

			{/* Sisi Kiri: Ilustrasi */}
			<div className="hidden md:flex flex-1 flex-col items-center justify-center p-6 lg:p-10 bg-linear-to-br from-primary/5 to-transparent relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[60px]" />
				<LoginIllustration className="animated w-60 lg:w-72 h-fit relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-transform hover:scale-105 duration-500 hover:-translate-y-2" />
				<div className="relative z-10 mt-8 text-center">
					<h3 className="text-xl lg:text-2xl font-black text-base-content tracking-tight">
						Portal Akses{" "}
						<span className="text-primary">NetQuest</span>
					</h3>
					<p className="text-base-content/60 mt-1.5 text-sm font-medium max-w-xs mx-auto">
						Sistem siap menerima identitas pemain. Masuk untuk
						melanjutkan misimu.
					</p>
				</div>
			</div>

			{/* Sisi Kanan: Form Login */}
			{/* overflow-y-auto berjaga-jaga jika dibuka di HP layar sangat kecil */}
			<div className="flex-1 flex flex-col justify-center p-6 sm:p-10 lg:p-12 relative z-10 bg-base-100/50 overflow-y-auto">
				<div className="w-full max-w-sm mx-auto space-y-5 lg:space-y-6">
					{/* Logo Pengganti Navbar */}
					<div className="flex justify-center lg:justify-start mb-2">
						<LogoComponents className="w-32 sm:w-40 h-fit drop-shadow-md" />
					</div>

					<div className="text-center lg:text-left">
						<h2 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm">
							Selamat Datang! 👋
						</h2>
						<p className="text-base-content/60 mt-1.5 text-sm font-medium">
							Silakan masukkan NIM dan Password.
						</p>
					</div>

					<LoginForm />
				</div>
			</div>
		</div>
	);
}
