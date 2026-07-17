import { Link } from "@tanstack/react-router";
import { Network, ArrowRight } from "lucide-react";

export function HeroSection() {
	return (
		<section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
			{/* Decorative Background */}
			<div className="absolute inset-0 w-full h-full">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000" />
			</div>

			<div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
				<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200 border border-base-300 mb-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
					<Network className="w-4 h-4 text-primary" />
					<span className="text-sm font-semibold text-base-content/80">
						Pembelajaran Jaringan Berbasis Gamifikasi
					</span>
				</div>
				
				<h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 animate-in slide-in-from-bottom-6 duration-700 fade-in">
					Kuasai Jaringan.<br />
					Naik Level. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Taklukan Tantangannya.</span>
				</h1>
				
				<p className="text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto mb-10 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-150">
					Jelajahi dunia jaringan komputer melalui petualangan interaktif. 
					Belajar lebih seru dengan kuis, XP, level, dan leaderboard.
				</p>
				
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-10 duration-700 fade-in delay-300">
					<Link to="/auth/register" className="btn btn-primary btn-lg font-bold w-full sm:w-auto shadow-xl shadow-primary/20 hover:scale-105 transition-transform group">
						Mulai Petualangan
						<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</Link>
					<Link to="/auth/login" className="btn btn-outline btn-lg font-bold w-full sm:w-auto hover:bg-base-200">
						Masuk ke Akun
					</Link>
				</div>
			</div>
		</section>
	);
}
