import type { Question } from "@/feature/module/schema/question.schema";
import { useQuizState } from "../hooks/useQuizState";
import { useSubmitQuiz } from "../hooks/useSubmitQuiz";
import { useCompleteQuiz } from "../hooks/useCompleteQuiz";
import { useProfile } from "@/feature/auth/hooks";
import { QuestionMultipleChoice } from "./QuestionMultipleChoice";
import { QuestionCommandTyping } from "./QuestionCommandTyping";
import { QuestionSorting } from "./QuestionSorting";
import { QuestionMatching } from "./QuestionMatching";
import { QuestionCalculationInput } from "./QuestionCalculationInput";
import { QuestionTopology } from "./QuestionTopology";
import { QuestionRapidTrueFalse } from "./QuestionRapidTrueFalse";
import { QuestionVisualIdentification } from "./QuestionVisualIdentification";
import { QuestionType } from "../types/gameplay.types";
import { useNavigate } from "@tanstack/react-router";
import { Heart, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface QuizEngineProps {
	lessonId: string;
	moduleId: string;
	questions: Question[];
}

const evaluateAnswerLocal = (question: Question, answerValue: string): boolean => {
	switch (question.type) {
		case QuestionType.MULTIPLE_CHOICE:
		case QuestionType.RAPID_TRUE_FALSE:
		case QuestionType.VISUAL_IDENTIFICATION:
			return question.options?.find(opt => opt.id === answerValue)?.isCorrect ?? false;
		
		case QuestionType.COMMAND_TYPING: {
			const correctOpt = question.options?.find(opt => opt.isCorrect);
			if (!correctOpt) return false;
			const expected = correctOpt.optionText.trim().toLowerCase();
			const submitted = answerValue.trim().toLowerCase();
			return expected === submitted;
		}
		
		case QuestionType.SORTING:
		case QuestionType.MATCHING: {
			const correctOpt = question.options?.find(opt => opt.isCorrect);
			if (!correctOpt) return false;
			try {
				const expectedArr = JSON.parse(correctOpt.optionText);
				const submittedArr = JSON.parse(answerValue);
				return JSON.stringify(expectedArr) === JSON.stringify(submittedArr);
			} catch (e) {
				return false;
			}
		}
		
		case QuestionType.TOPOLOGY: {
			const correctOpt = question.options?.find(opt => opt.isCorrect);
			if (!correctOpt) return false;
			try {
				const expectedArr = JSON.parse(correctOpt.optionText) as string[];
				const submittedArr = JSON.parse(answerValue) as string[];
				expectedArr.sort();
				submittedArr.sort();
				return JSON.stringify(expectedArr) === JSON.stringify(submittedArr);
			} catch (e) {
				return false;
			}
		}
		
		default:
			return false;
	}
};

export function QuizEngine({ lessonId, moduleId, questions }: QuizEngineProps) {
	const navigate = useNavigate();
	const { data: user } = useProfile();
	const currentTotalXp = user?.xp || 0;
	
	const [localHearts, setLocalHearts] = useState(user?.hearts ?? 3);

	useEffect(() => {
		if (user?.hearts !== undefined) {
			setLocalHearts(user.hearts);
		}
	}, [user?.hearts]);

	const [currentAnswer, setCurrentAnswer] = useState<any>(null);
	const [attemptKey, setAttemptKey] = useState(0);

	const {
		currentQuestionIndex,
		recordAnswer,
		nextQuestion,
		isLastQuestion,
	} = useQuizState(questions.length);

	const submitQuizMutation = useSubmitQuiz();
	const completeQuizMutation = useCompleteQuiz(currentTotalXp);

	const currentQuestion = questions[currentQuestionIndex];

	const handleAnswerSubmit = (answerValue: string) => {
		if (localHearts <= 0) {
			toast.error("Nyawa Anda habis! Silakan pulihkan nyawa terlebih dahulu.");
			return;
		}

		setCurrentAnswer(answerValue);

		const isCorrect = evaluateAnswerLocal(currentQuestion, answerValue);

		if (isCorrect) {
			toast.success("Jawaban benar!");
			setCurrentAnswer(null);

			if (!isLastQuestion) {
				setAttemptKey(0);
				nextQuestion();
			}

			submitQuizMutation.mutate(
				{ lessonId, questionId: currentQuestion.id, answer: answerValue },
				{
					onSuccess: (data) => {
						recordAnswer(currentQuestion.id, answerValue, data.isCorrect);
						setLocalHearts(data.heartsLeft);
						if (isLastQuestion) {
							handleCompleteQuiz();
						}
					},
				}
			);
		} else {
			const newHearts = localHearts - 1;
			setLocalHearts(newHearts);
			toast.error(`Jawaban salah! Sisa Nyawa: ${newHearts}`);
			setCurrentAnswer(null);
			setAttemptKey((prev) => prev + 1);

			if (newHearts <= 0) {
				navigate({ to: "/roadmap/$moduleId", params: { moduleId } });
			}

			submitQuizMutation.mutate(
				{ lessonId, questionId: currentQuestion.id, answer: answerValue },
				{
					onSuccess: (data) => {
						recordAnswer(currentQuestion.id, answerValue, data.isCorrect);
						setLocalHearts(data.heartsLeft);
					},
				}
			);
		}
	};

	const handleCompleteQuiz = () => {
		completeQuizMutation.mutate(
			{ lessonId },
			{
				onSuccess: (data) => {
					toast.success(`Kuis Selesai! +${data.sessionScore} XP`);
					if (data.isLevelUp) {
						toast.success("Selamat! Anda Naik Level! 🎉", { duration: 5000, icon: '🌟' });
					}
					navigate({ to: "/roadmap/$moduleId", params: { moduleId } });
				},
				onError: () => {
					toast.error("Gagal menyimpan hasil kuis.");
				}
			}
		);
	};

	if (!currentQuestion) return null;

	const isPending = submitQuizMutation.isPending || completeQuizMutation.isPending;

	return (
		<div className="w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
			{/* Top Bar: Progress & Hearts */}
			<div className="flex items-center justify-between gap-4">
				<button 
					onClick={() => navigate({ to: "/roadmap/$moduleId", params: { moduleId } })}
					className="btn btn-ghost btn-circle btn-sm text-base-content/50 hover:text-base-content"
				>
					<XCircle className="w-6 h-6" />
				</button>
				
				<div className="flex-1 max-w-md bg-base-200 rounded-full h-4 overflow-hidden relative">
					<div 
						className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
						style={{ width: `${Math.max(5, ((currentQuestionIndex) / questions.length) * 100)}%` }}
					/>
				</div>

				<div className="flex items-center gap-2 text-error font-bold text-lg">
					<Heart fill="currentColor" className="w-6 h-6 animate-pulse" />
					<span>{localHearts}</span>
				</div>
			</div>

			{/* Question Card */}
			<div className="bg-base-100 rounded-3xl p-6 sm:p-10 shadow-sm border border-base-200">
				<div className="flex items-start justify-between mb-6">
					<span className="badge badge-primary badge-outline font-bold uppercase tracking-widest">
						Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
					</span>
				</div>

				{currentQuestion.type !== QuestionType.RAPID_TRUE_FALSE && (
					<h2 className="text-2xl sm:text-3xl font-bold text-base-content leading-tight mb-8">
						{currentQuestion.questionText}
					</h2>
				)}

				{/* Dynamic Question Rendering based on Type */}
				{currentQuestion.type === QuestionType.MULTIPLE_CHOICE && (
					<QuestionMultipleChoice
						options={currentQuestion.options || []}
						selectedOptionId={currentAnswer}
						onSelect={handleAnswerSubmit}
						disabled={isPending}
					/>
				)}

				{currentQuestion.type === QuestionType.COMMAND_TYPING && (
					<QuestionCommandTyping
						value={currentAnswer || ""}
						onChange={handleAnswerSubmit}
						disabled={isPending}
					/>
				)}

				{currentQuestion.type === QuestionType.CALCULATION_INPUT && (
					<QuestionCalculationInput
						value={currentAnswer || ""}
						onChange={handleAnswerSubmit}
						disabled={isPending}
					/>
				)}

				{currentQuestion.type === QuestionType.SORTING && (
					<QuestionSorting
						options={currentQuestion.options || []}
						selectedAnswer={currentAnswer}
						onSelect={handleAnswerSubmit}
						disabled={isPending}
					/>
				)}

				{currentQuestion.type === QuestionType.MATCHING && (
					<QuestionMatching
						options={currentQuestion.options || []}
						selectedAnswer={currentAnswer}
						onSelect={handleAnswerSubmit}
						disabled={isPending}
					/>
				)}

				{currentQuestion.type === QuestionType.TOPOLOGY && (
					<QuestionTopology
						nodes={currentQuestion.options || []}
						onSubmit={(answerStr) => handleAnswerSubmit(answerStr)}
						disabled={currentAnswer !== null}
					/>
				)}

				{currentQuestion.type === QuestionType.RAPID_TRUE_FALSE && (
					<QuestionRapidTrueFalse
						key={`${currentQuestion.id}-${attemptKey}`}
						questionText={currentQuestion.questionText}
						options={currentQuestion.options || []}
						onAnswer={(optionIds) => handleAnswerSubmit(optionIds[0])}
						isRetry={attemptKey > 0}
					/>
				)}

				{currentQuestion.type === QuestionType.VISUAL_IDENTIFICATION && (
					<QuestionVisualIdentification
						key={`${currentQuestion.id}-${attemptKey}`}
						options={currentQuestion.options || []}
						onAnswer={(optionIds) => handleAnswerSubmit(optionIds[0])}
						disabled={currentAnswer !== null}
					/>
				)}

				{isPending && (
					<div className="mt-8 flex justify-center">
						<span className="loading loading-dots loading-lg text-primary" />
					</div>
				)}
			</div>
		</div>
	);
}
