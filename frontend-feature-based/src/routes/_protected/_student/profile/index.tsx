import { createFileRoute } from "@tanstack/react-router";
import { useProfile } from "@/feature/auth/hooks/useProfile";
import { useUpdateProfile } from "@/feature/auth/hooks/useUpdateProfile";
import { getRankProgress } from "@/utils/rank.util";
import { useState, useEffect } from "react";
import { UserCircle, Shield, KeySquare, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_protected/_student/profile/")({
	component: ProfilePage,
});

function ProfilePage() {
	const { data: user, isLoading: isProfileLoading } = useProfile();
	const { mutate: updateProfile, isPending } = useUpdateProfile();

	const [name, setName] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		if (user) {
			setName(user.name || "");
		}
	}, [user]);

	if (isProfileLoading || !user) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		);
	}

	const handleUpdateProfile = (e: React.FormEvent) => {
		e.preventDefault();
		updateProfile(
			{ name, password },
			{
				onSuccess: () => {
					setPassword("");
				},
			}
		);
	};

	const getInitials = (nameStr?: string) => {
		if (!nameStr) return "M";
		return nameStr.substring(0, 2).toUpperCase();
	};

	const progress = getRankProgress(user.xp);

	return (
		<div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
			{/* Profile Info Container */}
			<div className="bg-base-100 rounded-[2rem] shadow-sm border border-base-200/50 p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
				{/* Avatar */}
				<div className="avatar shrink-0 relative group">
					<div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors duration-500"></div>
					<div className="bg-gradient-to-br from-base-100 to-base-200 text-primary size-28 sm:size-32 rounded-full flex items-center justify-center shadow-lg border border-base-300 relative z-10 group-hover:scale-105 transition-transform duration-300">
						<span className="text-4xl sm:text-5xl font-black tracking-widest bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
							{getInitials(user.name)}
						</span>
					</div>
				</div>
				
				{/* Info */}
				<div className="flex-1">
					<h1 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">{user.name}</h1>
					<div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
						<div className="flex items-center gap-2 text-base-content/70 font-mono text-sm bg-base-200/50 px-4 py-2 rounded-xl border border-base-300/50 shadow-sm">
							<UserCircle className="w-4 h-4 text-primary" />
							{user.nim}
						</div>
						<div className="flex items-center gap-2 text-base-content/70 font-semibold text-sm bg-base-200/50 px-4 py-2 rounded-xl border border-base-300/50 shadow-sm">
							<Shield className="w-4 h-4 text-secondary" />
							{progress.currentRank.title}
						</div>
					</div>
				</div>
			</div>

			{/* Two Column Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				
				{/* Left Column: Gamification Stats (col-span-5) */}
				<div className="lg:col-span-5 space-y-6">
					<div className="bg-base-100 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-base-200/50 hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
						<div className="flex items-center gap-3 mb-8">
							<div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center border border-primary/10 shadow-inner">
								<Shield className="w-5 h-5" />
							</div>
							<h3 className="font-bold text-xl text-base-content">Progres Pangkat</h3>
						</div>
						
						<div className="flex-1 flex flex-col items-center justify-center space-y-8">
							<div className="relative group">
								<div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500"></div>
								<div 
									className="radial-progress text-primary bg-base-100 text-2xl font-black border-8 border-base-200 shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] relative z-10 transition-all duration-700 hover:scale-105" 
									style={{ "--value": progress.percentage, "--size": "12rem", "--thickness": "1rem" } as any}
								>
									<div className="flex flex-col items-center justify-center drop-shadow-sm">
										<span className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user.xp}</span>
										<span className="text-sm font-bold text-base-content/40 tracking-widest uppercase mt-1">XP</span>
									</div>
								</div>
							</div>
							
							<div className="w-full space-y-5 bg-base-200/30 p-5 rounded-3xl border border-base-200/50">
								<div className="flex justify-between items-end px-1">
									<div>
										<p className="text-[10px] font-black text-base-content/40 uppercase tracking-widest mb-1">Saat ini</p>
										<p className="font-black text-base-content text-sm">{progress.currentRank.title}</p>
									</div>
									<div className="text-right">
										<p className="text-[10px] font-black text-base-content/40 uppercase tracking-widest mb-1">Selanjutnya</p>
										<p className="font-black text-base-content text-sm">{progress.nextRank?.title || "Maksimum"}</p>
									</div>
								</div>
								
								{!progress.isMaxRank && (
									<div className="w-full bg-base-300/50 rounded-full h-3 overflow-hidden shadow-inner border border-base-300">
										<div className="bg-gradient-to-r from-primary via-primary to-secondary h-full rounded-full relative overflow-hidden" style={{ width: `${progress.percentage}%` }}>
											<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjIiLz48L3N2Zz4=')] opacity-30"></div>
										</div>
									</div>
								)}
								
								{!progress.isMaxRank && (
									<p className="text-center text-xs font-semibold text-base-content/60 bg-base-100/50 py-2 rounded-xl border border-base-200/50">
										Butuh <span className="font-black text-primary">{progress.xpRequiredForNext - progress.xpInCurrentLevel} XP</span> lagi untuk naik pangkat.
									</p>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Right Column: Settings Form (col-span-7) */}
				<div className="lg:col-span-7">
					<form onSubmit={handleUpdateProfile} className="bg-base-100 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-base-200/50 hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
						<div className="flex items-center gap-3 mb-8">
							<div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-info/20 to-info/5 text-info flex items-center justify-center border border-info/10 shadow-inner">
								<KeySquare className="w-5 h-5" />
							</div>
							<h3 className="font-bold text-xl text-base-content">Pengaturan Akun</h3>
						</div>
						
						<div className="space-y-6 flex-1">
							{/* NIM (Read Only) */}
							<div className="form-control w-full relative">
								<label className="label pb-2">
									<span className="label-text font-bold text-base-content/70 text-xs uppercase tracking-wider">Nomor Induk Mahasiswa</span>
								</label>
								<div className="relative group">
									<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/40">
										<UserCircle className="w-5 h-5" />
									</div>
									<input 
										type="text" 
										value={user.nim} 
										disabled 
										className="input input-bordered w-full pl-11 bg-base-200/50 text-base-content/50 border-base-300/50 shadow-inner rounded-xl cursor-not-allowed" 
									/>
								</div>
								<label className="label pt-1.5">
									<span className="label-text-alt text-base-content/40 font-medium">NIM tidak dapat diubah karena merupakan identitas unik.</span>
								</label>
							</div>

							{/* Nama */}
							<div className="form-control w-full">
								<label className="label pb-2">
									<span className="label-text font-bold text-base-content/70 text-xs uppercase tracking-wider">Nama Tampilan</span>
								</label>
								<input 
									type="text" 
									value={name} 
									onChange={(e) => setName(e.target.value)}
									placeholder="Nama lengkap atau panggilan Anda" 
									className="input input-bordered w-full bg-base-100 focus:input-primary transition-all duration-300 shadow-sm rounded-xl focus:shadow-[0_0_15px_rgba(var(--color-primary),0.15)]" 
									required
									minLength={3}
								/>
							</div>

							{/* Password */}
							<div className="form-control w-full">
								<label className="label pb-2 flex justify-between items-center">
									<span className="label-text font-bold text-base-content/70 text-xs uppercase tracking-wider">Kata Sandi Baru</span>
									<span className="badge badge-sm badge-ghost font-bold text-[10px]">Opsional</span>
								</label>
								<input 
									type="password" 
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••" 
									className="input input-bordered w-full bg-base-100 focus:input-primary transition-all duration-300 shadow-sm rounded-xl focus:shadow-[0_0_15px_rgba(var(--color-primary),0.15)]"
									minLength={8} 
								/>
								<label className="label pt-1.5">
									<span className="label-text-alt text-base-content/50 font-medium">Kosongkan jika Anda tidak ingin mengubah kata sandi. Minimal 8 karakter.</span>
								</label>
							</div>

							<div className="pt-8 mt-auto flex justify-end">
								<button 
									type="submit" 
									disabled={isPending || (!name.trim()) || (password.length > 0 && password.length < 8)}
									className="btn btn-primary min-w-[160px] rounded-2xl font-black text-sm uppercase tracking-wider shadow-[0_8px_20px_-6px_rgba(var(--color-primary),0.5)] hover:shadow-[0_12px_25px_-6px_rgba(var(--color-primary),0.6)] hover:-translate-y-0.5 transition-all duration-300 border-none"
								>
									{isPending ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										"Simpan Perubahan"
									)}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
