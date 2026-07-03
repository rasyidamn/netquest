export const QuestionType = {
	MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
	CALCULATION_INPUT: "CALCULATION_INPUT",
	COMMAND_TYPING: "COMMAND_TYPING",
	SORTING: "SORTING",
	MATCHING: "MATCHING",
	IMAGE_LABELING: "IMAGE_LABELING",
	TOPOLOGY: "TOPOLOGY",
} as const;

export interface TheoryDoneResponse {
	xpGained: number;
	currentTotalXp: number;
}

export interface QuizSubmitResult {
	isCorrect: boolean;
	addedXp: number;
	heartsLeft: number;
	questionType: typeof QuestionType;
}

export interface CompleteQuizResult {
	isNewBestScore: boolean;
	sessionScore: number;
	bestScore: number;
	newTotalXp: number;
	nextLessonId: string | null;
}

export interface RecoverHeartResult {
	hearts: number;
	recoveryCount: number;
	lastRecoveryDate: string;
}
