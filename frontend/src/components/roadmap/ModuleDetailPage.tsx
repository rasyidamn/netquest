import { useCallback, useMemo } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { moduleApi } from "@/api/module.api";
import { useMyProgress } from "@/hooks/progress/useMyProgress";
import { useModules } from "@/hooks/module/useModules";
import {
	IconLock,
	IconRocket,
	IconTrophy,
	IconArrowLeft,
	IconBook2,
	IconCheck,
	IconPlayerPlay,
	IconEye,
} from "@tabler/icons-react";
import type { LessonType, ProgressItem } from "@/types/api.type";

type LessonStatus = "LOCKED" | "ACTIVE" | "COMPLETED";

function ModuleDetailSkeleton() {
	return (
		<div className="flex flex-col gap-6 py-8 w-full max-w-3xl mx-auto px-4">
			<div className="skeleton h-6 w-48" />
			<div className="skeleton h-10 w-full" />
			<div className="flex flex-col gap-8">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex gap-4 items-center">
						<div className="skeleton h-12 w-12 rounded-full shrink-0" />
						<div className="skeleton h-28 w-full rounded-2xl" />
					</div>
				))}
			</div>
		</div>
	);
}

function ModuleDetailError({ message }: { message: string }) {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center max-w-3xl mx-auto">
			<div className="bg-error/10 p-6 rounded-full mb-4">
				<IconLock size={48} className="text-error" />
			</div>
			<p className="text-error text-xl font-bold">Gagal Memuat Modul</p>
			<p className="text-base-content/60 mt-2 max-w-md">{message}</p>
		</div>
	);
}

function ModuleDetailEmpty() {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center max-w-3xl mx-auto">
			<IconBook2 size={64} className="text-base-content/20 mb-4" />
			<h3 className="text-2xl font-bold text-base-content/70">Belum Ada Pelajaran</h3>
			<p className="text-base-content/50 mt-2">
				Modul ini belum memiliki pelajaran apapun.
			</p>
		</div>
	);
}

function ModuleNotFound() {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center max-w-3xl mx-auto">
			<IconBook2 size={64} className="text-base-content/20 mb-4" />
			<h3 className="text-2xl font-bold text-base-content/70">Modul Tidak Ditemukan</h3>
			<p className="text-base-content/50 mt-2">
				Modul yang kamu cari tidak tersedia atau sudah dihapus.
			</p>
		</div>
	);
}

function LessonCard({
	lesson,
	status,
	showTopDivider,
	isLast,
	onSelect,
}: {
	lesson: LessonType;
	status: LessonStatus;
	showTopDivider: boolean;
	isLast: boolean;
	onSelect: (lessonId: string) => void;
}) {
	const isLocked = status === "LOCKED";
	const isActive = status === "ACTIVE";
	const isCompleted = status === "COMPLETED";
	const dividerClassName = isCompleted ? "bg-success h-1.5" : "bg-base-300 h-1";

	return (
		<li>
			{showTopDivider && <hr className={dividerClassName} />}

			{/* Lingkaran Status */}
			<div className="timeline-middle">
				<div
					className={`flex size-10 items-center justify-center rounded-full border-2 shadow-sm z-10 ${
						isActive
							? "bg-primary text-primary-content border-primary"
							: isCompleted
								? "bg-success text-success-content border-success"
								: "bg-base-200 text-base-content/40 border-base-300"
					}`}
				>
					{isActive && <IconRocket size={18} />}
					{isCompleted && <IconTrophy size={18} />}
					{isLocked && <IconLock size={18} />}
				</div>
			</div>

			{/* Kartu Pelajaran */}
			<div className="timeline-end w-full mb-6 ml-4">
				<div
					className={`card shadow-md transition-all duration-300 ${
						isActive
							? "bg-gradient-to-br from-base-100 to-primary/5 border-2 border-primary shadow-primary/20"
							: isCompleted
								? "bg-base-100 border border-success/30"
								: "bg-base-200/50 border border-dashed border-base-300 opacity-60"
					}`}
				>
					<div className="card-body p-5">
						<div className="flex items-start justify-between gap-3">
							<div className="flex-1 min-w-0">
								<h3
									className={`card-title text-lg ${isActive ? "text-primary" : ""}`}
								>
									{lesson.title}
								</h3>
								<div className="flex flex-wrap items-center gap-2 mt-2">
									<span
										className={`badge badge-sm ${
											lesson.type === "THEORY" ? "badge-info" : "badge-warning"
										}`}
									>
										{lesson.type === "THEORY" ? "Teori" : "Kuis"}
									</span>
									{isCompleted && (
										<span className="badge badge-success badge-sm gap-1">
											<IconCheck size={12} />
											Selesai
										</span>
									)}
								</div>
							</div>
						</div>

						<div className="card-actions mt-4 justify-end">
							{isActive && (
								<button
									onClick={() => onSelect(lesson.id)}
									className="btn btn-primary btn-sm gap-2 shadow-lg shadow-primary/20"
								>
									<IconPlayerPlay size={16} />
									Mulai Belajar
								</button>
							)}
							{isCompleted && (
								<button
									onClick={() => onSelect(lesson.id)}
									className="btn btn-outline btn-success btn-sm gap-2"
								>
									<IconEye size={16} />
									Lihat Lagi
								</button>
							)}
							{isLocked && (
								<button className="btn btn-sm btn-disabled gap-2" disabled>
									<IconLock size={16} />
									Terkunci
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			{!isLast && <hr className={dividerClassName} />}
		</li>
	);
}

export function ModuleDetailPage() {
	const { moduleId } = useParams({ from: "/_authenticated/_student/roadmap/$moduleId" });
	const navigate = useNavigate();

	const modulesQuery = useModules();
	const lessonsQuery = useQuery({
		queryKey: ["lessons", moduleId],
		queryFn: async () => {
			const res = await moduleApi.getLessons(moduleId);
			if (!res.success) {
				throw new Error(res.message || "Gagal mengambil daftar pelajaran");
			}
			return (res.data ?? []) as LessonType[];
		},
		enabled: !!moduleId,
	});
	const progressQuery = useMyProgress();

	// Cari data module dari daftar modules
	const currentModule = useMemo(() => {
		if (!modulesQuery.data) return null;
		return modulesQuery.data.find((m) => m.id === moduleId) ?? null;
	}, [modulesQuery.data, moduleId]);

	// Sorted lessons berdasarkan lessonSequence
	const sortedLessons = useMemo(() => {
		if (!lessonsQuery.data) return [];
		return [...lessonsQuery.data].sort((a, b) => a.lessonSequence - b.lessonSequence);
	}, [lessonsQuery.data]);

	// Build progress map untuk quick lookup
	const progressMap = useMemo(() => {
		const map = new Map<string, ProgressItem>();
		if (progressQuery.data) {
			for (const p of progressQuery.data) {
				map.set(p.lessonId, p);
			}
		}
		return map;
	}, [progressQuery.data]);

	// Tentukan status tiap lesson dengan logika "First Available Lesson":
	// lesson belum selesai pertama jadi ACTIVE, sisanya LOCKED.
	const lessonStatuses = useMemo(() => {
		const statuses = new Map<string, LessonStatus>();
		let foundActive = false;

		for (const lesson of sortedLessons) {
			const progress = progressMap.get(lesson.id);

			if (progress?.status === "COMPLETED") {
				statuses.set(lesson.id, "COMPLETED");
			} else if (!foundActive) {
				statuses.set(lesson.id, "ACTIVE");
				foundActive = true;
			} else {
				statuses.set(lesson.id, "LOCKED");
			}
		}

		return statuses;
	}, [sortedLessons, progressMap]);

	const handleBackToRoadmap = useCallback(() => {
		navigate({ to: "/roadmap" });
	}, [navigate]);

	const handleSelectLesson = useCallback(
		(lessonId: string) => {
			navigate({ to: "/lesson/$lessonId", params: { lessonId } });
		},
		[navigate],
	);

	const isLoading =
		modulesQuery.isLoading || lessonsQuery.isLoading || progressQuery.isLoading;
	const isError = modulesQuery.isError || lessonsQuery.isError || progressQuery.isError;
	const errorMessage =
		modulesQuery.error?.message ||
		lessonsQuery.error?.message ||
		progressQuery.error?.message ||
		"Terjadi kesalahan saat memuat data.";

	if (isLoading) return <ModuleDetailSkeleton />;
	if (isError) return <ModuleDetailError message={errorMessage} />;
	if (!currentModule) return <ModuleNotFound />;

	return (
		<div className="max-w-3xl mx-auto px-4 py-8">
			{/* Breadcrumb */}
			<nav className="breadcrumbs text-sm text-base-content/60 mb-4">
				<ul>
					<li>
						<button
							onClick={handleBackToRoadmap}
							className="hover:text-primary transition-colors"
						>
							Peta Belajar
						</button>
					</li>
					<li className="text-base-content/80 font-semibold">
						Tahap {currentModule.sequence}
					</li>
				</ul>
			</nav>

			{/* Header Module */}
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-extrabold">{currentModule.title}</h1>
					<p className="text-base-content/60 mt-1">
						Tahap {currentModule.sequence} — {sortedLessons.length} Pelajaran
					</p>
				</div>
				<button
					onClick={handleBackToRoadmap}
					className="btn btn-ghost btn-sm gap-2"
				>
					<IconArrowLeft size={18} />
					Kembali ke Peta Belajar
				</button>
			</div>

			{/* Daftar Pelajaran (Timeline) */}
			{sortedLessons.length === 0 ? (
				<ModuleDetailEmpty />
			) : (
				<ul className="timeline max-md:timeline-compact timeline-vertical">
					{sortedLessons.map((lesson, index) => (
						<LessonCard
							key={lesson.id}
							lesson={lesson}
							status={lessonStatuses.get(lesson.id) ?? "LOCKED"}
							showTopDivider={index > 0}
							isLast={index === sortedLessons.length - 1}
							onSelect={handleSelectLesson}
						/>
					))}
				</ul>
			)}
		</div>
	);
}