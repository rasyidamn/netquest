import type { ModuleType } from "@/schemas/module.schema";
import { cn } from "@/utils/cn";
import { useRouter } from "@tanstack/react-router";
import { ItalicTitle } from "@/components/ui/ItalicTitle";
import {
	ArrowRightIcon,
	CheckIcon,
	LockIcon,
	RocketIcon,
	RouteIcon,
} from "lucide-react";

interface RoadmapPreviewProps {
	isLoading?: boolean;
	modules?: ModuleType[];
	progress?: any[]; // Menggunakan any[] sementara karena API mengembalikan ModuleProgress, bukan ProgressItem standar
}

// LOGIKA DIPERBAIKI: Menyesuaikan dengan response API getMyProgress yang berbasis Modul
function getModuleStatus(
	moduleId: string,
	progress: any[] | undefined,
	modules: ModuleType[] | undefined,
): "LOCKED" | "ACTIVE" | "COMPLETED" {
	if (!progress || !modules) return "LOCKED";

	const moduleProgress = progress.find((p) => p.moduleId === moduleId);

	if (moduleProgress) {
		return moduleProgress.status;
	}

	// Fallback jika user baru pertama kali main dan belum ada progress:
	// Modul pertama ACTIVE, sisanya LOCKED
	return modules[0]?.id === moduleId ? "ACTIVE" : "LOCKED";
}

function getStatusIcon(status: "LOCKED" | "ACTIVE" | "COMPLETED") {
	switch (status) {
		case "LOCKED":
			return <LockIcon size={18} className="text-base-content/30" />;
		case "ACTIVE":
			return (
				<RocketIcon
					size={18}
					className="text-primary drop-shadow-[0_0_5px_rgba(var(--color-primary),0.8)]"
				/>
			);
		case "COMPLETED":
			return <CheckIcon size={18} className="text-success" />;
	}
}

function RoadmapSkeleton() {
	return (
		<div className="card bg-base-200/30 backdrop-blur-xl border border-white/5 shadow-lg overflow-hidden">
			<div className="card-body p-6">
				<div className="skeleton h-5 w-40 mb-6 rounded-md bg-base-300/50" />
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex gap-4 items-center">
							<div className="skeleton size-10 rounded-full bg-base-300/50 shrink-0" />
							<div className="skeleton h-12 w-full rounded-xl bg-base-300/30" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export function RoadmapPreview({
	isLoading,
	modules,
	progress,
}: RoadmapPreviewProps) {
	const router = useRouter();

	if (isLoading) {
		return <RoadmapSkeleton />;
	}

	if (!modules || modules.length === 0) {
		return null;
	}

	// Ambil maksimal 4 modul untuk preview di dashboard agar tidak terlalu panjang
	const previewModules = modules.slice(0, 4);

	return (
		<div className="card relative overflow-hidden bg-base-200/40 backdrop-blur-xl border border-white/10 shadow-lg">
			{/* Aksen Cahaya Ambient (Kiri Atas) */}
			<div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

			<div className="card-body p-6 relative z-10">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-sm font-bold uppercase tracking-[0.2em] text-base-content/60 flex items-center gap-2">
						<RouteIcon size={18} className="text-primary/70" />
						Log Perjalanan
					</h3>
					<button
						onClick={() => router.navigate({ to: "/roadmap" })}
						className="text-xs font-bold text-primary hover:text-primary-focus transition-colors flex items-center gap-1"
					>
						Lihat Peta <ArrowRightIcon size={14} />
					</button>
				</div>

				<div className="relative pl-2">
					{/* Garis Vertikal Mini-Timeline */}
					<div className="absolute left-6 top-2 bottom-2 w-0.5 bg-base-300/30 rounded-full" />

					<div className="space-y-3">
						{previewModules.map((mod, index) => {
							const status = getModuleStatus(
								mod.id,
								progress,
								modules,
							);
							const isActive = status === "ACTIVE";
							const isCompleted = status === "COMPLETED";

							return (
								<button
									key={mod.id}
									onClick={() =>
										router.navigate({ to: "/roadmap" })
									}
									className={cn(
										"group relative flex w-full items-center gap-4 rounded-xl pr-4 py-2 text-left transition-all duration-300 z-10 overflow-hidden",
										isActive
											? "bg-linear-to-r from-primary/10 to-transparent border border-primary/20 hover:border-primary/40 shadow-sm"
											: "hover:bg-base-200/30 border border-transparent hover:border-white/5",
									)}
								>
									{/* Highlight Kiri untuk Modul Aktif */}
									{isActive && (
										<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
									)}

									{/* Lingkaran Angka/Ikon */}
									<div
										className={cn(
											"relative flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black transition-colors z-10 bg-base-100",
											isActive
												? "border-primary text-primary shadow-[0_0_10px_rgba(var(--color-primary),0.3)]"
												: isCompleted
													? "border-success text-success bg-success/10"
													: "border-base-300 text-base-content/30",
										)}
									>
										{isActive ? (
											<span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
										) : null}
										{index + 1}
									</div>

									{/* Teks Judul Modul */}
									<div className="flex-1 min-w-0">
										<p
											className={cn(
												"font-bold truncate transition-colors duration-300",
												isActive
													? "text-primary drop-shadow-sm"
													: isCompleted
														? "text-base-content/90"
														: "text-base-content/40",
											)}
										>
											<ItalicTitle text={mod.title} />
										</p>
										{isActive && (
											<p className="text-[10px] uppercase tracking-wider font-bold text-primary/70 mt-0.5">
												Sedang Dikerjakan
											</p>
										)}
									</div>

									{/* Status Ikon Kanan */}
									<div className="flex items-center gap-2 shrink-0">
										{getStatusIcon(status)}
										{isActive && (
											<ArrowRightIcon
												size={16}
												className="text-primary transition-transform duration-300 group-hover:translate-x-1"
											/>
										)}
									</div>
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
