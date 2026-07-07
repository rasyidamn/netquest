import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, FileEdit, HelpCircle } from "lucide-react";
import { LessonEditor } from "../-components/LessonEditor";
import { QuestionBuilder } from "../-components/question-builder/QuestionBuilder";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useLessonDetail } from "@/feature/module/hooks/useLessonDetail";

export const Route = createFileRoute("/_protected/admin/lessons/$lessonId")({
	component: AdminLessonEditorPage,
});

function AdminLessonEditorPage() {
	const { lessonId } = Route.useParams();
	const [activeTab, setActiveTab] = useState<"materi" | "kuis">("materi");

	const { data: lesson, isLoading, isError } = useLessonDetail(lessonId);

	
		// PERBAIKAN 1: Logika perpindahan tab diamankan di dalam useEffect
		useEffect(() => {
			if (lesson?.type === "QUIZ" && activeTab === "materi") {
				setActiveTab("kuis");
			}
		}, [lesson?.type, activeTab]);

	if (isLoading) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		);
	}

	if (isError || !lesson) {
		return (
			<div className="p-8 text-center bg-base-100 rounded-xl shadow-sm border border-base-200">
				<h2 className="text-2xl font-bold text-error mb-2">
					Sistem Menolak Akses
				</h2>
				<p className="text-base-content/70">
					Gagal memuat data lesson. Pastikan koordinat ID valid.
				</p>
				<Link to="/admin/content" className="btn btn-outline mt-4">
					Kembali ke Arsip
				</Link>
			</div>
		);
	}

	const showEditor = lesson.type === "THEORY";

	return (
		// PERBAIKAN 2: Gunakan min-h untuk memastikan tinggi minimal menutupi sisa layar,
		// namun tetap membiarkannya memanjang jika form di dalamnya sangat panjang.
		<div className="min-h-[calc(100vh-8rem)] flex flex-col space-y-6">
			{/* Header & Tabs */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-base-300 pb-4 shrink-0 gap-4">
				<div className="flex items-center gap-4">
					<Link
						to="/admin/content"
						className="btn btn-circle btn-ghost"
					>
						<ChevronLeft className="w-6 h-6" />
					</Link>
					<div className="flex items-center gap-3">
						<FileEdit className="w-8 h-8 text-primary" />
						<div>
							<h1 className="text-2xl font-black text-base-content">
								Editor Misi
							</h1>
							<p className="text-sm font-bold text-primary">
								Modul: {lesson.module?.title}
							</p>
						</div>
					</div>
				</div>

				<div role="tablist" className="tabs tabs-boxed bg-base-200 p-1">
					{showEditor && (
						<a
							role="tab"
							className={clsx(
								"tab font-semibold transition-colors",
								activeTab === "materi" && "tab-active",
							)}
							onClick={() => setActiveTab("materi")}
						>
							<FileEdit className="w-4 h-4 mr-2" /> Materi
						</a>
					)}
					<a
						role="tab"
						className={clsx(
							"tab font-semibold transition-colors",
							activeTab === "kuis" && "tab-active",
						)}
						onClick={() => setActiveTab("kuis")}
					>
						<HelpCircle className="w-4 h-4 mr-2" />{" "}
						{showEditor ? "Pop Quiz" : "Daftar Soal"}
					</a>
				</div>
			</div>

			{/* Content Area */}
			{/* PERBAIKAN 3: overflow-y-auto dihapus agar scroll terjadi secara global pada halaman */}
			<div className="flex-1 w-full pb-8">
				{activeTab === "materi" && showEditor ? (
					<LessonEditor lesson={lesson as any} />
				) : activeTab === "kuis" ? (
					<QuestionBuilder
						lessonId={lesson.id}
						questions={lesson.questions || []}
					/>
				) : null}
			</div>
		</div>
	);
}
