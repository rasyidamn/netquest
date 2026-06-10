import { z } from "zod";
export declare class LessonSchema {
    static readonly LESSON_MODEL: z.ZodObject<{
        id: z.ZodUUID;
        moduleId: z.ZodUUID;
        title: z.ZodString;
        lessonSequence: z.ZodNumber;
        type: z.ZodEnum<{
            readonly THEORY: "THEORY";
            readonly QUIZ: "QUIZ";
        }>;
        xpReward: z.ZodNumber;
    }, z.core.$strip>;
    static readonly LESSON_WITH_MODULE: z.ZodObject<{
        id: z.ZodUUID;
        moduleId: z.ZodUUID;
        title: z.ZodString;
        lessonSequence: z.ZodNumber;
        type: z.ZodEnum<{
            readonly THEORY: "THEORY";
            readonly QUIZ: "QUIZ";
        }>;
        xpReward: z.ZodNumber;
        module: z.ZodObject<{
            id: z.ZodUUID;
            title: z.ZodString;
            sequence: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strict>;
    static readonly CREATE_LESSON_REQUEST: z.ZodObject<{
        type: z.ZodEnum<{
            readonly THEORY: "THEORY";
            readonly QUIZ: "QUIZ";
        }>;
        title: z.ZodString;
        lessonSequence: z.ZodNumber;
        xpReward: z.ZodNumber;
    }, z.core.$strict>;
    static readonly UPDATE_LESSON_REQUEST: z.ZodObject<{
        type: z.ZodOptional<z.ZodEnum<{
            readonly THEORY: "THEORY";
            readonly QUIZ: "QUIZ";
        }>>;
        title: z.ZodOptional<z.ZodString>;
        lessonSequence: z.ZodOptional<z.ZodNumber>;
        xpReward: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
    static readonly LESSON_ID_PARAM: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
    static readonly LESSON_DETAIL_ADMIN_RESPONSE: z.ZodDiscriminatedUnion<[z.ZodObject<{
        id: z.ZodUUID;
        moduleId: z.ZodUUID;
        title: z.ZodString;
        lessonSequence: z.ZodNumber;
        xpReward: z.ZodNumber;
        type: z.ZodLiteral<"THEORY">;
        material: z.ZodNullable<z.ZodObject<{
            id: z.ZodUUID;
            lessonId: z.ZodString;
            content: z.ZodString;
            mediaUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodUUID;
        moduleId: z.ZodUUID;
        title: z.ZodString;
        lessonSequence: z.ZodNumber;
        xpReward: z.ZodNumber;
        type: z.ZodLiteral<"QUIZ">;
        questions: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            lessonId: z.ZodString;
            questionText: z.ZodString;
            xpReward: z.ZodNumber;
            options: z.ZodArray<z.ZodObject<{
                id: z.ZodUUID;
                questionId: z.ZodString;
                optionText: z.ZodString;
                isCorrect: z.ZodBoolean;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>], "type">;
    static readonly LESSON_DETAIL_MAHASISWA_RESPONSE: z.ZodDiscriminatedUnion<[z.ZodObject<{
        id: z.ZodUUID;
        moduleId: z.ZodUUID;
        title: z.ZodString;
        lessonSequence: z.ZodNumber;
        xpReward: z.ZodNumber;
        type: z.ZodLiteral<"THEORY">;
        material: z.ZodNullable<z.ZodObject<{
            id: z.ZodUUID;
            lessonId: z.ZodString;
            content: z.ZodString;
            mediaUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodUUID;
        moduleId: z.ZodUUID;
        title: z.ZodString;
        lessonSequence: z.ZodNumber;
        xpReward: z.ZodNumber;
        type: z.ZodLiteral<"QUIZ">;
        questions: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            lessonId: z.ZodString;
            questionText: z.ZodString;
            xpReward: z.ZodNumber;
            options: z.ZodArray<z.ZodObject<{
                id: z.ZodUUID;
                questionId: z.ZodString;
                optionText: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>], "type">;
}
export type CreateLessonRequest = z.infer<typeof LessonSchema.CREATE_LESSON_REQUEST>;
export type UpdateLessonRequest = z.infer<typeof LessonSchema.UPDATE_LESSON_REQUEST>;
export type LessonResponse = z.infer<typeof LessonSchema.LESSON_MODEL>;
export type LessonWithModule = z.infer<typeof LessonSchema.LESSON_WITH_MODULE>;
//# sourceMappingURL=lesson.schema.d.ts.map