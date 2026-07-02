import z from "zod";
export declare class GameplaySchema {
    static readonly SUBMIT_ANSWER_REQUEST: z.ZodObject<{
        lessonId: z.ZodUUID;
        questionId: z.ZodUUID;
        answer: z.ZodString;
    }, z.z.core.$strict>;
    static readonly RECOVER_HEART_REQUEST: z.ZodObject<{
        lessonId: z.ZodUUID;
        readDuration: z.ZodNumber;
    }, z.z.core.$strict>;
    static readonly COMPLETE_QUIZ_REQUEST: z.ZodObject<{
        lessonId: z.ZodString;
    }, z.z.core.$strict>;
}
export type SubmitAnswerRequest = z.infer<typeof GameplaySchema.SUBMIT_ANSWER_REQUEST>;
export type RecoverHeartRequest = z.infer<typeof GameplaySchema.RECOVER_HEART_REQUEST>;
export type CompleteQuizRequest = z.infer<typeof GameplaySchema.COMPLETE_QUIZ_REQUEST>;
//# sourceMappingURL=gameplay.schema.d.ts.map