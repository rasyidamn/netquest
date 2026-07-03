import { useProfile } from "@/feature/auth/hooks";
import type { MaterialType } from "@/feature/module/schema/material.schema";
import type { Question } from "@/feature/module/schema/question.schema";
import { ChevronRight, HeartPulse, BrainCircuit } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useTheoryDone } from "../hooks/useTheoryDone";
import { useRecoverHeart } from "../hooks/useRecoverHeart";
import { useSubmitQuiz } from "../hooks/useSubmitQuiz";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { QuestionMultipleChoice } from "./QuestionMultipleChoice";
import { QuestionType } from "../types/gameplay.types";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

interface TheoryViewerProps {
	lessonId: string;
	moduleId: string;
	title: string;
	material?: MaterialType;
	questions?: Question[];
}

export function TheoryViewer({ lessonId, moduleId, title, material, questions }: TheoryViewerProps) {
	const navigate = useNavigate();
	const { data: user } = useProfile();
	const theoryDoneMutation = useTheoryDone();
	const recoverHeartMutation = useRecoverHeart();
	const submitQuizMutation = useSubmitQuiz();

	const [readSeconds, setReadSeconds] = useState(0);
	const [isPopQuizPassed, setIsPopQuizPassed] = useState(false);
	// Bug Fix #1 & #2: Track selected answer and lock options after first click
	const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
	const [hasAnswered, setHasAnswered] = useState(false);

	const hasPopQuiz = questions && questions.length > 0;
	const popQuizQuestion = hasPopQuiz ? questions[0] : null;

	const initialContent = useMemo(() => {
		if (material?.content) {
			try {
				return JSON.parse(material.content);
			} catch (e) {
				// Fallback untuk legacy text/html yang belum berbentuk JSON
				return [
					{
						type: "paragraph",
						content: material.content,
					}
				];
			}
		}
		return undefined;
	}, [material]);

	const editor = useCreateBlockNote({
		initialContent,
	});

	const goBack = () => navigate({ to: "/roadmap/$moduleId", params: { moduleId } });

	useEffect(() => {
		const timer = setInterval(() => setReadSeconds((s) => s + 1), 1000);
		return () => clearInterval(timer);
	}, []);

	const handleComplete = () => {
		theoryDoneMutation.mutate(
			{ lessonId },
			{
				onSuccess: (data) => {
					toast.success(`Materi selesai! +${data.addedXp} XP`);
					goBack();
				},
				onError: (error: any) => {
					const message: string = error?.response?.data?.message || error?.message || "";
					const isAlreadyDone = message.includes("sudah menyels") || message.includes("sudah menyelesaikan");
					if (isAlreadyDone) {
						// Materi memang sudah dikerjakan sebelumnya, arahkan saja
						toast.success("Materi sudah pernah diselesaikan.");
					} else {
						// Error sungguhan — tampilkan pesan asli ke user
						toast.error(message || "Gagal menyimpan progres. Coba lagi.");
					}
					goBack();
				},
			},
		);
	};

	const handleRecoverHeart = () => {
		if (readSeconds < 60) {
			toast.error("Baca materi minimal 60 detik untuk memulihkan nyawa.");
			return;
		}

		recoverHeartMutation.mutate(
			{ lessonId, readDuration: readSeconds },
			{
				onSuccess: (data) => {
					toast.success(`Nyawa pulih! Sisa kuota harian: ${data.remainingDailyQuota}`);
				},
				onError: (error) => {
					toast.error(error.message);
				},
			},
		);
	};

	const handlePopQuizSubmit = (answerValue: string) => {
		if (!popQuizQuestion) return;
		// Jika sudah menjawab (benar atau salah), abaikan klik berikutnya
		if (hasAnswered) return;

		if (user && user.hearts <= 0) {
			toast.error("Nyawa Anda habis! Silakan pulihkan nyawa terlebih dahulu.");
			return;
		}

		// Bug Fix #1: Kunci semua tombol SEBELUM menunggu respons API
		// Bug Fix #2: Simpan pilihan untuk ditampilkan sebagai feedback visual
		setSelectedOptionId(answerValue);
		setHasAnswered(true);

		submitQuizMutation.mutate(
			{ lessonId, questionId: popQuizQuestion.id, answer: answerValue },
			{
				onSuccess: (data) => {
					if (data.isCorrect) {
						// XP tidak disimpan dari submitQuiz — hanya dari theoryDone
						// Tampilkan pesan sukses tanpa angka XP agar tidak menyesatkan
						toast.success("Jawaban benar! Lanjutkan untuk menyelesaikan materi.");
						setIsPopQuizPassed(true);
					} else {
						toast.error(`Jawaban salah! Sisa Nyawa: ${data.heartsLeft}. Coba lagi.`);
						if (data.heartsLeft <= 0) {
							goBack();
							return;
						}
						// Reset state agar mahasiswa bisa mencoba jawaban lain
						setSelectedOptionId(null);
						setHasAnswered(false);
					}
				},
				onError: (error) => {
					toast.error(error.message);
					// Jika API error, kembalikan state agar bisa dicoba lagi
					setSelectedOptionId(null);
					setHasAnswered(false);
				}
			}
		);
	};

	return (
		<div className="w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
			{/* Top Bar: Navigation & Progress Indicator */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						{title}
					</h1>
					<p className="text-base-content/60 mt-1">
						Pahami materi ini dengan saksama.
					</p>
				</div>
				{user && user.hearts < 3 && (
					<div className="flex flex-col gap-2">
						<button
							onClick={handleRecoverHeart}
							disabled={recoverHeartMutation.isPending || readSeconds < 60}
							className="btn btn-outline btn-error btn-sm sm:btn-md group relative overflow-hidden"
						>
							<HeartPulse className="w-4 h-4 group-hover:scale-110 transition-transform" />
							{recoverHeartMutation.isPending ? "Memulihkan..." : "Pulihkan Nyawa"}
						</button>
						{readSeconds < 60 && (
							<span className="text-xs text-error/80 text-center">
								Tunggu {60 - readSeconds}s lagi
							</span>
						)}
					</div>
				)}
			</div>

			{/* Content Area */}
			<div className="bg-base-100 p-6 sm:p-8 rounded-2xl shadow-sm border border-base-200 blocknote-theme-container">
				<BlockNoteView editor={editor} editable={false} theme="dark" />
			</div>

			<style dangerouslySetInnerHTML={{__html: `
				/* Penyesuaian tema kustom agar menyatu dengan DaisyUI */
				.blocknote-theme-container {
					font-family: inherit;
				}
				.bn-editor {
					background-color: transparent !important;
					padding-inline: 0 !important;
				}
				.bn-container[data-theme="dark"] {
					--bn-colors-editor-text: oklch(var(--bc)) !important;
					--bn-colors-editor-background: transparent !important;
				}
			`}} />

			{/* Pop Quiz Section */}
			{hasPopQuiz && !isPopQuizPassed && (
				<div className="bg-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/20 shadow-inner">
					<div className="flex items-center gap-3 mb-6">
						<BrainCircuit className="w-8 h-8 text-primary" />
						<div>
							<h3 className="text-xl font-bold text-primary">Kuis Kejutan!</h3>
							<p className="text-sm text-base-content/60">Jawab pertanyaan ini untuk menyelesaikan materi.</p>
						</div>
					</div>
					
					<div className="bg-base-100 rounded-xl p-6 border border-base-200 shadow-sm">
						<h4 className="text-lg font-bold mb-6">{popQuizQuestion.questionText}</h4>
						
						{popQuizQuestion.type === QuestionType.MULTIPLE_CHOICE ? (
							<QuestionMultipleChoice
								options={popQuizQuestion.options || []}
								selectedOptionId={selectedOptionId}
								onSelect={handlePopQuizSubmit}
								disabled={submitQuizMutation.isPending || hasAnswered}
							/>
						) : (
							<p className="text-error italic">Tipe kuis {popQuizQuestion.type} belum didukung di Pop-Quiz.</p>
						)}
					</div>
				</div>
			)}

			{/* Footer Action */}
			{(!hasPopQuiz || isPopQuizPassed) && (
				<div className="flex justify-end pt-4">
					<button
						onClick={handleComplete}
						disabled={theoryDoneMutation.isPending}
						className="btn btn-primary btn-lg rounded-full px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all animate-in fade-in zoom-in duration-300"
					>
						{theoryDoneMutation.isPending ? (
							<span className="loading loading-spinner" />
						) : (
							<>
								Selesai Belajar
								<ChevronRight className="w-5 h-5 ml-1" />
							</>
						)}
					</button>
				</div>
			)}
		</div>
	);
}
