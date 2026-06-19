import { useState, useCallback, useEffect } from "react";
import { useProfile } from "@/hooks/auth/useProfile";
import { useQuizState } from "@/hooks/gameplay/useQuizState";
import { useSubmitQuiz } from "@/hooks/gameplay/useSubmitQuiz";
import { useCompleteQuiz } from "@/hooks/gameplay/useCompleteQuiz";
import { showXpGainToast } from "@/components/shared/XpGainToast";
import type { LessonDetailType } from "@/types/api.type";
import { QuizProgressBar } from "./QuizProgressBar";
import { HeartStatusBar } from "./HeartStatusBar";
import { QuestionCard } from "./QuestionCard";
import { QuizResult } from "./QuizResult";
import { GameOverScreen } from "./GameOverScreen";
import { RecoveryScreen } from "./RecoveryScreen";

type QuizPhase = "loading" | "question" | "result" | "gameover" | "recovery";

interface QuizEngineProps {
	lesson: LessonDetailType;
}

export function QuizEngine({ lesson }: QuizEngineProps) {
	const { data: profile, isLoading: profileLoading } = useProfile();
	const questions = lesson.questions ?? [];

	const {
		currentQuestionIndex,
		selectedOptionId,
		score,
		selectOption,
		recordAnswer,
		nextQuestion,
		isLastQuestion,
		resetQuiz,
		progress,
	} = useQuizState(questions.length);

	const submitQuizMutation = useSubmitQuiz();
	const completeQuizMutation = useCompleteQuiz(profile?.xp ?? 0);

	const [hearts, setHearts] = useState(profile?.hearts ?? 3);
	const [phase, setPhase] = useState<QuizPhase>("question");
	const [submittedOptionId, setSubmittedOptionId] = useState<string | null>(null);
	const [lastResult, setLastResult] = useState<{
		isCorrect: boolean;
		correctOptionId?: string;
	} | null>(null);
	const [completeResult, setCompleteResult] = useState<({
		xpGained: number;
		currentTotalXp: number;
		isLevelUp: boolean;
	}) | null>(null);

	// Sync hearts from profile
	useEffect(() => {
		if (profile?.hearts !== undefined) {
			setHearts(profile.hearts);
		}
	}, [profile?.hearts]);

	const currentQuestion = questions[currentQuestionIndex];

	const handleSubmitAnswer = useCallback(async () => {
		if (!selectedOptionId || !currentQuestion || submittedOptionId) return;

		setSubmittedOptionId(selectedOptionId);

		try {
			const result = await submitQuizMutation.mutateAsync({
				lessonId: lesson.id,
				questionId: currentQuestion.id,
				optionId: selectedOptionId,
			});

			setHearts(result.heartsRemaining);
			setLastResult({
				isCorrect: result.isCorrect,
				correctOptionId: result.correctOptionId,
			});
			recordAnswer(currentQuestion.id, selectedOptionId, result.isCorrect);

			if (result.isCorrect) {
				showXpGainToast(result.xpGained);
			}

			// Delay then proceed
			setTimeout(() => {
				if (result.heartsRemaining <= 0) {
					setPhase("gameover");
					setSubmittedOptionId(null);
					setLastResult(null);
					return;
				}

				if (isLastQuestion) {
					handleCompleteQuiz();
				} else {
					nextQuestion();
					setSubmittedOptionId(null);
					setLastResult(null);
				}
			}, 1500);
		} catch {
			setSubmittedOptionId(null);
		}
	}, [selectedOptionId, currentQuestion, submittedOptionId, submitQuizMutation, lesson.id, recordAnswer, isLastQuestion, nextQuestion]);

	const handleCompleteQuiz = useCallback(async () => {
		const finalScore = Math.round((score / questions.length) * 100);

		try {
			const result = await completeQuizMutation.mutateAsync({
				lessonId: lesson.id,
				finalScore,
			});

			setCompleteResult(result);
			setPhase("result");
			showXpGainToast(result.xpGained);
		} catch {
			// error handled by mutation
		}
	}, [score, questions.length, completeQuizMutation, lesson.id]);

	const handleRetry = useCallback(() => {
		resetQuiz();
		setHearts(profile?.hearts ?? 3);
		setPhase("question");
		setSubmittedOptionId(null);
		setLastResult(null);
		setCompleteResult(null);
	}, [resetQuiz, profile]);

	const handleBackToMaterial = useCallback(() => {
		setPhase("recovery");
	}, []);

	const handleRecoverySuccess = useCallback(() => {
		setHearts(3);
		setPhase("question");
	}, []);

	if (profileLoading || questions.length === 0) {
		return (
			<div className="flex items-center justify-center py-16">
				<span className="loading loading-spinner loading-lg text-primary" />
			</div>
		);
	}

	// Recovery screen
	if (phase === "recovery") {
		return (
			<RecoveryScreen
				lessonId={lesson.id}
				hearts={hearts}
				heartsUpdatedAt={profile?.heartsUpdatedAt?.toString()}
				onRecoverySuccess={handleRecoverySuccess}
			/>
		);
	}

	// Game over screen
	if (phase === "gameover") {
		return <GameOverScreen onBackToMaterial={handleBackToMaterial} />;
	}

	// Result screen
	if (phase === "result" && completeResult) {
		return (
			<QuizResult
				score={score}
				totalQuestions={questions.length}
				result={completeResult}
				onRetry={handleRetry}
				onBack={handleBackToMaterial}
			/>
		);
	}

	// Question phase
	return (
		<div className="mx-auto max-w-2xl space-y-6">
			{/* Top bar: progress + hearts */}
			<div className="flex items-center justify-between gap-4">
				<QuizProgressBar current={currentQuestionIndex} total={questions.length} />
				<HeartStatusBar hearts={hearts} />
			</div>

			{/* Question card */}
			{currentQuestion && (
				<div className="card bg-base-100 shadow-sm">
					<div className="card-body">
						<QuestionCard
							question={currentQuestion}
							selectedOptionId={selectedOptionId}
							submittedOptionId={submittedOptionId}
							isCorrect={lastResult?.isCorrect ?? null}
							correctOptionId={lastResult?.correctOptionId ?? null}
							disabled={submitQuizMutation.isPending}
							onSelectOption={selectOption}
						/>
					</div>
				</div>
			)}

			{/* Submit button */}
			{!submittedOptionId && (
				<button
					type="button"
					disabled={!selectedOptionId || submitQuizMutation.isPending}
					onClick={handleSubmitAnswer}
					className="btn btn-primary w-full gap-2"
				>
					{submitQuizMutation.isPending ? (
						<span className="loading loading-spinner loading-sm" />
					) : (
						"Jawab"
					)}
				</button>
			)}

			{/* Feedback after submit */}
			{submittedOptionId && lastResult && (
				<div
					className={`rounded-xl p-4 text-center text-sm font-medium ${
						lastResult.isCorrect
							? "bg-success/10 text-success"
							: "bg-error/10 text-error"
					}`}
				>
					{lastResult.isCorrect
						? "✅ Jawaban benar!"
						: "❌ Jawaban salah"}
				</div>
			)}
		</div>
	);
}