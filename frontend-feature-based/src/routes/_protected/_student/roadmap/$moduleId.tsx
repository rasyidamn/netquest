import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRoadmap } from "./-hooks/useRoadmap";
import { Book, Play, ArrowLeft, CheckCircle2, Lock, Sparkles, Star } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

export const Route = createFileRoute(
	"/_protected/_student/roadmap/$moduleId",
)({
	component: ModuleDetailPage,
});

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: { type: "spring" as const, stiffness: 300, damping: 24 },
	},
};

function ModuleDetailPage() {
	const { moduleId } = Route.useParams();
	const navigate = useNavigate();
	const { data: roadmapItems, isLoading, isError } = useRoadmap();

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[70vh]">
				<span className="loading loading-bars loading-lg text-primary" />
			</div>
		);
	}

	if (isError || !roadmapItems) {
		return (
			<div className="text-center py-20">
				<p className="text-error font-bold">Gagal memuat detail modul.</p>
			</div>
		);
	}

	const item = roadmapItems.find((m) => m.module.id === moduleId);

	if (!item) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
				<p className="font-black text-3xl text-base-content/50">Modul Kosong</p>
				<button onClick={() => navigate({ to: "/roadmap" })} className="btn btn-primary btn-outline rounded-full px-8">
					<ArrowLeft className="w-5 h-5 mr-2" />
					Kembali ke Peta
				</button>
			</div>
		);
	}

	const { module, lessons, status, currentLessonId } = item;
	const isModuleLocked = status === "LOCKED";

	// currentLessonId = lesson yang sedang aktif (belum selesai)
	// completedCount = jumlah lesson SEBELUM lesson aktif = semua yang sudah selesai
	// Jika currentLessonId kosong (belum ada progress), default ke lesson pertama → 0 selesai
	const resolvedCurrentId = currentLessonId || (lessons[0]?.id ?? "");
	const currentIndex = lessons.findIndex((l) => l.id === resolvedCurrentId);

	let completedCount = 0;
	if (status === "COMPLETED") {
		completedCount = lessons.length;
	} else if (!isModuleLocked) {
		// currentIndex adalah posisi lesson aktif; semua lesson sebelumnya sudah selesai
		completedCount = currentIndex > 0 ? currentIndex : 0;
	}

	const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

	return (
		<motion.div 
			initial="hidden"
			animate="show"
			variants={containerVariants}
			className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10 space-y-12"
		>
			{/* HERO SECTION - GLASSMORPHISM & NEON GLOW */}
			<motion.div 
				variants={itemVariants}
				className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-base-200/90 to-base-100/60 backdrop-blur-3xl border border-white/5 shadow-2xl p-8 sm:p-12"
			>
				{/* Background Ornaments */}
				<div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
				<div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/20 rounded-full blur-[80px] pointer-events-none" />
				
				<div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
					<div className="flex-1 space-y-6">
						<button
							onClick={() => navigate({ to: "/roadmap" })}
							className="group flex items-center text-sm font-bold text-base-content/60 hover:text-primary transition-colors"
						>
							<span className="bg-base-300/50 group-hover:bg-primary/20 p-2 rounded-full mr-3 transition-colors">
								<ArrowLeft className="w-4 h-4" />
							</span>
							KEMBALI KE PETA
						</button>

						<div className="space-y-4">
							<div className="flex flex-wrap items-center gap-3">
								<span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-black tracking-widest uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(var(--color-primary),0.2)]">
									<Sparkles className="w-4 h-4" />
									Chapter {module.sequence}
								</span>
								{status === "COMPLETED" && (
									<span className="px-4 py-1.5 rounded-full bg-success/10 border border-success/30 text-success text-sm font-black tracking-widest uppercase flex items-center gap-2">
										<CheckCircle2 className="w-4 h-4" />
										Selesai
									</span>
								)}
							</div>
							<h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-base-content to-base-content/60 leading-tight tracking-tight drop-shadow-sm">
								{module.title}
							</h1>
							<p className="text-base-content/70 text-lg sm:text-xl max-w-2xl leading-relaxed font-medium">
								{module.description}
							</p>
						</div>
					</div>

					{/* RADIAL PROGRESS INDICATOR */}
					<div className="shrink-0 flex justify-center items-center">
						<div className="relative flex items-center justify-center w-40 h-40 rounded-full bg-base-300/30 border border-white/5 shadow-inner backdrop-blur-md">
							<svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
								<circle
									cx="64"
									cy="64"
									r="58"
									className="text-base-content/10"
									strokeWidth="8"
									fill="none"
									stroke="currentColor"
								/>
								<motion.circle
									cx="64"
									cy="64"
									r="58"
									className={status === "COMPLETED" ? "text-success" : "text-primary"}
									strokeWidth="8"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									initial={{ strokeDasharray: 364.42, strokeDashoffset: 364.42 }}
									animate={{ strokeDashoffset: 364.42 - (364.42 * progressPercent) / 100 }}
									transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
								/>
							</svg>
							<div className="absolute flex flex-col items-center justify-center">
								<span className="text-3xl font-black text-base-content">{progressPercent}%</span>
								<span className="text-xs font-bold text-base-content/50 uppercase tracking-wider mt-1">Selesai</span>
							</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* TIMELINE LIST */}
			<motion.div variants={itemVariants} className="space-y-6">
				<div className="flex items-center gap-3 px-2">
					<div className="p-3 rounded-xl bg-base-200 text-base-content/80 shadow-inner">
						<Book className="w-6 h-6" />
					</div>
					<h2 className="text-2xl font-black text-base-content tracking-tight">
						Daftar Misi ({lessons.length})
					</h2>
				</div>

				{lessons.length === 0 ? (
					<div className="bg-base-200/40 p-12 rounded-[2rem] text-center border border-dashed border-base-300 backdrop-blur-sm">
						<p className="text-base-content/50 font-medium text-lg">Materi sedang dipersiapkan oleh instruktur.</p>
					</div>
				) : (
					<div className="relative mt-10">
						{/* Garis Vertikal Latar (Track) */}
						<div className="absolute left-6 sm:left-9 top-6 bottom-6 w-1.5 bg-base-300/50 rounded-full" />
						
						<div className="space-y-8">
							{(() => { let foundCurrent = false; return lessons.map((lesson, idx) => {
								let lessonStatus: "LOCKED" | "ACTIVE" | "COMPLETED" = "LOCKED";
								
								if (isModuleLocked) {
									lessonStatus = "LOCKED";
								} else if (status === "COMPLETED") {
									lessonStatus = "COMPLETED";
								} else {
									if (lesson.id === resolvedCurrentId) {
										foundCurrent = true;
										lessonStatus = "ACTIVE";
									} else if (!foundCurrent) {
										lessonStatus = "COMPLETED";
									} else {
										lessonStatus = "LOCKED";
									}
								}

								return (
									<motion.div 
										variants={itemVariants}
										key={lesson.id} 
										className="relative flex items-center pl-16 sm:pl-24 group"
									>
										{/* Node Garis (Dot) */}
										<div className={clsx(
											"absolute left-4 sm:left-7 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-4 shadow-lg transition-all duration-500 z-10",
											lessonStatus === "COMPLETED" ? "bg-success border-base-100 shadow-success/30" :
											lessonStatus === "ACTIVE" ? "bg-primary border-base-100 shadow-[0_0_15px_rgba(var(--color-primary),0.6)] scale-125 animate-pulse" :
											"bg-base-300 border-base-100 group-hover:bg-base-content/20"
										)} />

										{/* Garis Vertikal Progres (Fill) */}
										{lessonStatus === "COMPLETED" && idx !== lessons.length - 1 && (
											<div className="absolute left-[1.6rem] sm:left-[2.35rem] top-1/2 w-1.5 h-[calc(100%+2rem)] bg-gradient-to-b from-success to-success/50 z-0" />
										)}
										{lessonStatus === "ACTIVE" && idx !== lessons.length - 1 && (
											<div className="absolute left-[1.6rem] sm:left-[2.35rem] top-1/2 w-1.5 h-[calc(100%+2rem)] bg-gradient-to-b from-primary to-base-300/50 z-0" />
										)}

										{/* Card Konten */}
										<motion.div
											whileHover={lessonStatus !== "LOCKED" ? { scale: 1.015, y: -2 } : {}}
											whileTap={lessonStatus !== "LOCKED" ? { scale: 0.98 } : {}}
											onClick={() => lessonStatus !== "LOCKED" && navigate({ to: `/lesson/${lesson.id}` })}
											className={clsx(
												"w-full flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 sm:p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden",
												lessonStatus === "LOCKED"
													? "bg-base-200/30 border-base-300/40 opacity-60 grayscale cursor-not-allowed"
													: lessonStatus === "COMPLETED"
													? "bg-base-100 border-success/20 hover:border-success/50 hover:shadow-success/10 hover:shadow-xl"
													: "bg-base-100 border-primary/30 hover:border-primary hover:shadow-primary/20 hover:shadow-2xl"
											)}
										>
											{/* Highlight Background untuk Active */}
											{lessonStatus === "ACTIVE" && (
												<div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
											)}

											<div className="flex items-center gap-5 relative z-10">
												<div className={clsx(
													"flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 font-black text-xl shadow-inner transition-colors",
													lessonStatus === "LOCKED" ? "bg-base-300 text-base-content/40" : 
													lessonStatus === "COMPLETED" ? "bg-success/10 text-success" :
													"bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content"
												)}>
													{lessonStatus === "COMPLETED" ? <CheckCircle2 className="w-7 h-7" /> : 
													 lessonStatus === "LOCKED" ? <Lock className="w-6 h-6" /> : idx + 1}
												</div>
												<div className="space-y-1.5">
													<h3 className={clsx(
														"font-black text-xl sm:text-2xl transition-colors tracking-tight",
														lessonStatus === "LOCKED" ? "text-base-content/50" : "text-base-content"
													)}>
														{lesson.title}
													</h3>
													<div className="flex items-center gap-3">
														<span className={clsx(
															"badge badge-sm sm:badge-md font-bold uppercase tracking-wider border-0",
															lessonStatus === "COMPLETED" ? "bg-success/10 text-success" :
															lessonStatus === "ACTIVE" ? "bg-primary/10 text-primary" :
															"bg-base-300 text-base-content/60"
														)}>
															{lesson.type.replace(/_/g, " ")}
														</span>
														<span className={clsx(
															"flex items-center gap-1.5 text-sm sm:text-base font-bold",
															lessonStatus === "LOCKED" ? "text-base-content/40" : "text-warning"
														)}>
															<Star className={clsx("w-4 h-4", lessonStatus !== "LOCKED" && "fill-warning")} />
															{lesson.xpReward} XP
														</span>
													</div>
												</div>
											</div>
											
											<div className="relative z-10 shrink-0 mt-4 sm:mt-0">
												<button
													disabled={lessonStatus === "LOCKED"}
													className={clsx(
														"btn rounded-full px-6 sm:px-8 border-none shadow-lg transition-all flex items-center gap-2",
														lessonStatus === "LOCKED" ? "btn-disabled bg-base-300 text-base-content/30" : 
														lessonStatus === "COMPLETED" ? "btn-success hover:scale-105 hover:shadow-success/40" :
														"btn-primary hover:scale-105 hover:shadow-primary/40"
													)}
												>
													<span className="hidden sm:inline-block font-bold text-base tracking-wide">
														{lessonStatus === "COMPLETED" ? "Ulangi Misi" : "Mulai Misi"}
													</span>
													<Play className="w-5 h-5 fill-current" />
												</button>
											</div>
										</motion.div>
									</motion.div>
								)
				})})()}
						</div>
					</div>
				)}
			</motion.div>
		</motion.div>
	);
}
