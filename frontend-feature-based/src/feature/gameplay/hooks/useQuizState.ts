import { useState, useCallback } from "react";

interface AnswerRecord {
	questionId: string;
	selectedOptionId: string;
	isCorrect: boolean;
}

export function useQuizState(totalQuestions: number) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
	const [score, setScore] = useState(0);
	const [answers, setAnswers] = useState<AnswerRecord[]>([]);

	const selectOption = useCallback((optionId: string) => {
		setSelectedOptionId(optionId);
	}, []);

	const recordAnswer = useCallback(
		(questionId: string, optionId: string, isCorrect: boolean) => {
			setAnswers((prev) => [...prev, { questionId, selectedOptionId: optionId, isCorrect }]);
			if (isCorrect) {
				setScore((prev) => prev + 1);
			}
			setSelectedOptionId(null);
		},
		[],
	);

	const nextQuestion = useCallback(() => {
		setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
	}, [totalQuestions]);

	const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
	const progress = totalQuestions > 0 ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100) : 0;

	const resetQuiz = useCallback(() => {
		setCurrentQuestionIndex(0);
		setSelectedOptionId(null);
		setScore(0);
		setAnswers([]);
	}, []);

	return {
		currentQuestionIndex,
		selectedOptionId,
		score,
		answers,
		selectOption,
		recordAnswer,
		nextQuestion,
		isLastQuestion,
		progress,
		resetQuiz,
	};
}