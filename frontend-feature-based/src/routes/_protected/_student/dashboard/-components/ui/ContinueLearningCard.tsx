import { useRouter } from "@tanstack/react-router";
import { ArrowRightIcon, PlayIcon, TargetIcon } from "lucide-react";

interface ContinueLearningCardProps {
	isLoading?: boolean;
	progress?: any[]; // Menggunakan any[] sementara menyesuaikan dengan ModuleProgress
}

function findActiveModule(progress: any[] | undefined) {
	if (!progress) return null;
	// Cari modul yang statusnya ACTIVE
	return progress.find((p) => p.status === "ACTIVE") || null;
}

function ContinueLearningSkeleton() {
	return (
		<div className="card bg-base-200/30 backdrop-blur-xl border border-white/5 shadow-lg overflow-hidden">
			<div className="card-body p-6 sm:p-8 flex-col sm:flex-row items-start sm:items-center gap-6">
				<div className="skeleton size-16 rounded-2xl bg-base-300/50 shrink-0" />
				<div className="flex-1 space-y-3 w-full">
					<div className="skeleton h-4 w-24 rounded-full bg-base-300/50" />
					<div className="skeleton h-8 w-3/4 sm:w-64 rounded-lg bg-base-300/30" />
					<div className="skeleton h-4 w-48 rounded-full bg-base-300/50" />
				</div>
				<div className="skeleton h-12 w-full sm:w-32 rounded-xl bg-base-300/50 shrink-0 mt-4 sm:mt-0" />
			</div>
		</div>
	);
}

export function ContinueLearningCard({
	isLoading,
	progress,
}: ContinueLearningCardProps) {
	const router = useRouter();

	if (isLoading) {
		return <ContinueLearningSkeleton />;
	}

	const activeModule = findActiveModule(progress);

	// Jika tidak ada modul aktif (mungkin sudah tamat semua, atau belum mulai), sembunyikan card
	if (!activeModule) {
		return null;
	}

	return (
		<div className="card relative overflow-hidden bg-linear-to-br from-primary/10 via-base-200/60 to-secondary/5 backdrop-blur-xl border border-primary/20 shadow-[0_8px_30px_rgba(var(--color-primary),0.1)] group">
			{/* Aksen Cahaya Belakang */}
			<div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[60px] pointer-events-none transition-colors duration-700 group-hover:bg-primary/20" />

			{/* Garis Pindai (Scanline effect) opsional untuk nuansa sci-fi */}
			<div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.02)_50%)] bg-size-[100%_4px] pointer-events-none" />

			<div className="card-body p-6 sm:p-8 flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
				{/* Ikon Kiri (Play Button) */}
				<div className="relative shrink-0">
					{/* Gelombang Sonar */}
					<div className="absolute inset-0 bg-primary animate-ping opacity-20 rounded-2xl" />
					<div className="relative flex size-16 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30 text-primary shadow-[0_0_20px_rgba(var(--color-primary),0.3)] backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
						<PlayIcon
							size={32}
							className="ml-1"
							fill="currentColor"
						/>
					</div>
				</div>

				{/* Informasi Teks */}
				<div className="flex-1 w-full">
					<div className="flex items-center gap-2 mb-1.5">
						<span className="relative flex h-2.5 w-2.5">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span>
						</span>
						<span className="text-[11px] font-black uppercase tracking-[0.2em] text-error/90">
							Misi Tertunda
						</span>
					</div>

					<h3 className="text-xl sm:text-2xl font-black text-base-content tracking-tight drop-shadow-sm line-clamp-2">
						{activeModule.title || "Modul Belajar Selanjutnya"}
					</h3>

					<p className="mt-1.5 text-sm font-medium text-base-content/60 flex items-center gap-1.5">
						<TargetIcon size={16} className="opacity-70" />
						Sistem mendeteksi ada misi yang belum diselesaikan.
					</p>
				</div>

				{/* Tombol Aksi */}
				<div className="shrink-0 mt-4 sm:mt-0 w-full sm:w-auto">
					<button
						onClick={() =>
							router.navigate({
								to: activeModule.moduleId
									? `/roadmap/${activeModule.moduleId}`
									: "/roadmap",
							})
						}
						className="btn btn-primary w-full sm:w-auto px-8 gap-2 border-0 shadow-[0_0_20px_rgba(var(--color-primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.6)] hover:scale-105 transition-all duration-300"
					>
						Lanjutkan Misi
						<ArrowRightIcon
							size={18}
							className="group-hover:translate-x-1 transition-transform"
						/>
					</button>
				</div>
			</div>
		</div>
	);
}
