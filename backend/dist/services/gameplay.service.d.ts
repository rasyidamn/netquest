import type { CompleteQuizRequest, RecoverHeartRequest, SubmitAnswerRequest } from "../schemas/gameplay.schema.js";
import type { LessonWithModule } from "../schemas/lesson.schema.js";
export declare class GameplayService {
    static theoryDone: (userId: string, lessonId: string) => Promise<{
        addedXp: number;
        currentTotalXp: number;
    }>;
    static submitQuiz: (userId: string, validatedData: SubmitAnswerRequest) => Promise<{
        isCorrect: boolean;
        addedXp: number;
        currentTotalXp: number;
        heartsLeft: number;
    }>;
    static completeQuiz: (userId: string, validatedData: CompleteQuizRequest) => Promise<{
        isNewBestScore: boolean;
        bestScore: number;
        nextLessonId: any;
    }>;
    static recoverHeart: (userId: string, validatedData: RecoverHeartRequest) => Promise<{
        recovered: number;
        heartsLeft: number;
        remainingDailyQuota: number;
    }>;
    static unlockNextLesson: (tx: any, userId: string, currentLesson: LessonWithModule) => Promise<any>;
}
//# sourceMappingURL=gameplay.service.d.ts.map