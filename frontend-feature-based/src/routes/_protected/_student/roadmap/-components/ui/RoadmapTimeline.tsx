import {
	ArrowRight,
	BookIcon,
	CheckIcon,
	LockIcon,
	RocketIcon,
	TrophyIcon,
} from "lucide-react";
import type { RoadmapStatus } from "../../-types/roadmap.type";
import { useRoadmap } from "../../-hooks/useRoadmap";
import { useRouter } from "@tanstack/react-router";

function TimelineSkeleton() {
	return (
		<div className="flex flex-col gap-12 py-8 w-full max-w-4xl mx-auto px-4">
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="flex flex-col md:flex-row gap-8 w-full items-center opacity-50 animate-pulse"
				>
					<div className="skeleton h-20 w-20 shrink-0 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
					<div className="skeleton h-48 w-full md:w-[32rem] rounded-3xl" />
				</div>
			))}
		</div>
	);
}

function TimelineError() {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center">
			<div className="bg-error/10 p-8 rounded-full mb-6 shadow-[0_0_50px_rgba(var(--color-error),0.2)]">
				<LockIcon size={56} className="text-error" />
			</div>
			<h2 className="text-error text-3xl font-black tracking-tight">
				Koneksi Terputus
			</h2>
			<p className="text-base-content/60 mt-3 text-lg max-w-md">
				Sinyal menuju satelit pembelajaran terganggu. Mohon periksa
				jaringan Anda.
			</p>
		</div>
	);
}

// Logic Garis Gradient Cerdas
function getHrClass(
	currentStatus: RoadmapStatus,
	nextStatus?: RoadmapStatus,
): string {
	// Ketebalan garis
	const baseThickness = "w-1.5 md:w-2 rounded-full";

	if (currentStatus === "COMPLETED") {
		if (nextStatus === "ACTIVE")
			return `${baseThickness} bg-gradient-to-b from-success to-primary shadow-[0_0_10px_rgba(var(--color-primary),0.3)]`;
		return `${baseThickness} bg-success shadow-[0_0_10px_rgba(var(--color-success),0.3)]`;
	}
	if (currentStatus === "ACTIVE") {
		return `${baseThickness} bg-gradient-to-b from-primary to-base-300/30`;
	}
	return `w-1 border-l-[4px] border-dashed border-base-300/40 ml-[-2px] md:ml-[-1.5px]`;
}

export function RoadmapTimeline() {
	const { data: items, isLoading, isError } = useRoadmap();
	const router = useRouter();

	if (isLoading) return <TimelineSkeleton />;
	if (isError) return <TimelineError />;
	if (!items || items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<BookIcon
					size={80}
					className="text-base-content/10 mb-6 drop-shadow-xl"
				/>
				<h3 className="text-3xl font-black text-base-content/70">
					Peta Belum Terpetakan
				</h3>
				<p className="text-base-content/50 mt-3 text-lg">
					Misi belum tersedia untuk saat ini.
				</p>
			</div>
		);
	}

	return (
		<div className="w-full max-w-5xl mx-auto px-2 sm:px-6 py-8">
			<ul className="timeline max-md:timeline-compact timeline-snap-icon timeline-vertical">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;
					const nextStatus = !isLast
						? items[index + 1].status
						: undefined;
					const isLocked = item.status === "LOCKED";
					const isActive = item.status === "ACTIVE";
					const isCompleted = item.status === "COMPLETED";

					return (
						<li key={item.module.id}>
							{index > 0 && (
								<hr
									className={getHrClass(
										items[index - 1].status,
										item.status,
									)}
								/>
							)}

							{/* Lingkaran Ikon Utama */}
							<div className="timeline-middle z-20 mx-2 md:mx-4 py-4">
								<div className="relative group">
									{/* Pulsing Radar Effect for Active */}
									{isActive && (
										<div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-30 scale-150" />
									)}

									<div
										className={`relative flex size-14 md:size-20 items-center justify-center rounded-full border-4 shadow-xl backdrop-blur-md transition-transform duration-500 hover:scale-110 ${
											isActive
												? "bg-primary/10 text-primary border-primary shadow-[0_0_30px_rgba(var(--color-primary),0.4)]"
												: isCompleted
													? "bg-success/10 text-success border-success shadow-[0_0_20px_rgba(var(--color-success),0.2)]"
													: "bg-base-300/20 text-base-content/30 border-base-300/30"
										}`}
									>
										{isActive && (
											<RocketIcon
												size={36}
												className="drop-shadow-[0_0_8px_rgba(var(--color-primary),0.8)]"
											/>
										)}
										{isCompleted && (
											<TrophyIcon size={36} />
										)}
										{isLocked && <LockIcon size={32} />}
									</div>
								</div>
							</div>

							{/* Kontainer Kartu */}
							<div
								className={`timeline-${index % 2 === 0 ? "start" : "end"} w-full mb-16 flex ${
									index % 2 === 0
										? "justify-start md:justify-end"
										: "justify-start"
								}`}
							>
								<div
									className={`group card w-[85vw] sm:w-[26rem] md:w-[28rem] lg:w-[32rem] text-left transition-all duration-500 ease-out
                              max-md:ml-6
                              ${index % 2 === 0 ? "md:mr-10" : "md:ml-10"}
                              ${
									isActive
										? "bg-base-200/60 backdrop-blur-xl border border-primary/40 shadow-[0_8px_30px_rgba(var(--color-primary),0.15)] hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(var(--color-primary),0.25)]"
										: isCompleted
											? "bg-base-100/50 backdrop-blur-md border border-white/5 shadow-lg hover:-translate-y-1 hover:border-success/30"
											: "bg-base-300/10 border border-white/5 opacity-50 grayscale backdrop-blur-sm"
								}`}
								>
									{/* Glow Effect di dalam kartu aktif */}
									{isActive && (
										<div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full blur-2xl pointer-events-none" />
									)}

									<div className="card-body p-6 md:p-8 relative z-10">
										{/* Label Atas & Badge */}
										<div className="flex flex-wrap items-center gap-3 mb-4 justify-start">
											<span className="text-sm font-bold tracking-[0.2em] text-base-content/40 uppercase">
												Chapter {item.module.sequence}
											</span>
											{isActive && (
												<span className="badge badge-primary badge-sm px-3 py-2.5 font-bold shadow-[0_0_10px_rgba(var(--color-primary),0.4)]">
													<span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-2"></span>
													Berlangsung
												</span>
											)}
											{isCompleted && (
												<span className="badge badge-success badge-sm px-3 py-2.5 bg-success/20 border-0 text-success gap-1.5 font-bold">
													<CheckIcon size={14} />{" "}
													Selesai
												</span>
											)}
										</div>

										{/* Judul Modul */}
										<h3
											className={`card-title text-2xl md:text-3xl font-black tracking-tight leading-snug mb-2 ${isActive ? "text-primary drop-shadow-sm" : "text-base-content/90"}`}
										>
											{item.module.title}
										</h3>

										{/* Info Pelajaran */}
										<div className="flex items-center gap-2 mt-2 text-base-content/50 font-semibold bg-base-300/30 w-fit px-3 py-1.5 rounded-lg">
											<BookIcon size={18} />
											<span>
												{item.lessons.length} Misi
												Belajar
											</span>
										</div>

										{/* Card Actions (Tombol) */}
										{!isLocked && (
											<div className="card-actions mt-8 justify-start">
												<button
													onClick={() =>
														router.navigate({
															to: `/roadmap/${item.module.id}`,
														})
													}
													className={`btn w-full sm:w-auto px-8 transition-all duration-300 ${
														isActive
															? "btn-primary hover:scale-105 shadow-[0_0_20px_rgba(var(--color-primary),0.3)]"
															: "btn-outline btn-success bg-success/5 hover:bg-success hover:text-success-content"
													}`}
												>
													{isActive
														? "Mulai Penjelajahan"
														: "Buka Arsip"}
													{isActive && (
														<ArrowRight
															size={20}
															className="group-hover:translate-x-1 transition-transform"
														/>
													)}
												</button>
											</div>
										)}
									</div>
								</div>
							</div>

							{!isLast && (
								<hr
									className={getHrClass(
										item.status,
										nextStatus,
									)}
								/>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
