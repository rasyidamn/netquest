export enum QuestionType {
	MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
	CALCULATION_INPUT = "CALCULATION_INPUT",
	COMMAND_TYPING = "COMMAND_TYPING",
	SORTING = "SORTING",
	MATCHING = "MATCHING",
	TOPOLOGY = "TOPOLOGY",
	RAPID_TRUE_FALSE = "RAPID_TRUE_FALSE",
	VISUAL_IDENTIFICATION = "VISUAL_IDENTIFICATION",
}

export interface TheoryDoneResponse {
	addedXp: number;
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
	recovered: number;
	heartsLeft: number;
	remainingDailyQuota: number;
}
