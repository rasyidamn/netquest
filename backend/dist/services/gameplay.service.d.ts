import { QuestionType } from "../generated/prisma/enums.js";
import type { CompleteQuizRequest, RecoverHeartRequest, SubmitAnswerRequest } from "../schemas/gameplay.schema.js";
import type { LessonWithModule } from "../schemas/lesson.schema.js";
export declare class GameplayService {
    /**
     * Sinkronisasi nyawa berdasarkan cooldown (Lazy Evaluation).
     * Dipanggil sebelum operasi apapun yang memerlukan data nyawa yang akurat.
     * Cooldown: 30 menit per 1 nyawa.
     */
    static syncUserHearts: (userId: string) => Promise<{
        password: string;
        id: string;
        nim: string;
        name: string;
        role: import("../generated/prisma/enums.js").RoleEnum;
        xp: number;
        hearts: number;
        heartsUpdatedAt: Date;
        recoveryCount: number;
        lastRecoveryDate: Date;
        createdAt: Date;
    } | null>;
    static theoryDone: (userId: string, lessonId: string) => Promise<{
        addedXp: number;
        currentTotalXp: number;
    }>;
    static submitQuiz: (userId: string, validatedData: SubmitAnswerRequest) => Promise<{
        isCorrect: boolean;
        addedXp: number;
        heartsLeft: number;
        questionType: QuestionType;
    }>;
    static completeQuiz: (userId: string, validatedData: CompleteQuizRequest) => Promise<{
        sessionScore: number;
        newTotalXp: number;
        isLevelUp: boolean;
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