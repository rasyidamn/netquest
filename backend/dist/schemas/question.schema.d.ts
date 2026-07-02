import { z } from "zod";
export declare class QuestionSchema {
    static readonly QUESTION_MODEL: z.ZodObject<{
        id: z.ZodUUID;
        lessonId: z.ZodString;
        questionText: z.ZodString;
        xpReward: z.ZodNumber;
        type: z.ZodEnum<{
            readonly MULTIPLE_CHOICE: "MULTIPLE_CHOICE";
            readonly CALCULATION_INPUT: "CALCULATION_INPUT";
            readonly COMMAND_TYPING: "COMMAND_TYPING";
            readonly SORTING: "SORTING";
            readonly MATCHING: "MATCHING";
            readonly IMAGE_LABELING: "IMAGE_LABELING";
        }>;
    }, z.core.$strip>;
    static readonly QUESTION_OPTIONS_MODEL: z.ZodObject<{
        id: z.ZodUUID;
        lessonId: z.ZodString;
        questionText: z.ZodString;
        xpReward: z.ZodNumber;
        type: z.ZodEnum<{
            readonly MULTIPLE_CHOICE: "MULTIPLE_CHOICE";
            readonly CALCULATION_INPUT: "CALCULATION_INPUT";
            readonly COMMAND_TYPING: "COMMAND_TYPING";
            readonly SORTING: "SORTING";
            readonly MATCHING: "MATCHING";
            readonly IMAGE_LABELING: "IMAGE_LABELING";
        }>;
        options: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            questionId: z.ZodString;
            optionText: z.ZodString;
            isCorrect: z.ZodBoolean;
        }, z.core.$strip>>;
    }, z.core.$strict>;
    static readonly CREATE_QUESTION_WITH_OPTIONS_REQUEST: z.ZodObject<{
        type: z.ZodEnum<{
            readonly MULTIPLE_CHOICE: "MULTIPLE_CHOICE";
            readonly CALCULATION_INPUT: "CALCULATION_INPUT";
            readonly COMMAND_TYPING: "COMMAND_TYPING";
            readonly SORTING: "SORTING";
            readonly MATCHING: "MATCHING";
            readonly IMAGE_LABELING: "IMAGE_LABELING";
        }>;
        questionText: z.ZodString;
        xpReward: z.ZodNumber;
        options: z.ZodArray<z.ZodObject<{
            optionText: z.ZodString;
            isCorrect: z.ZodBoolean;
        }, z.core.$strip>>;
    }, z.core.$strict>;
    static readonly UPDATE_QUESTION_WITH_OPTIONS_REQUEST: z.ZodObject<{
        type: z.ZodOptional<z.ZodEnum<{
            readonly MULTIPLE_CHOICE: "MULTIPLE_CHOICE";
            readonly CALCULATION_INPUT: "CALCULATION_INPUT";
            readonly COMMAND_TYPING: "COMMAND_TYPING";
            readonly SORTING: "SORTING";
            readonly MATCHING: "MATCHING";
            readonly IMAGE_LABELING: "IMAGE_LABELING";
        }>>;
        questionText: z.ZodOptional<z.ZodString>;
        xpReward: z.ZodOptional<z.ZodNumber>;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            optionText: z.ZodString;
            isCorrect: z.ZodBoolean;
        }, z.core.$strip>>>;
    }, z.core.$strict>;
    static readonly QUESTION_ID_PARAM: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}
export type CreateQuestionWithOptionRequest = z.infer<typeof QuestionSchema.CREATE_QUESTION_WITH_OPTIONS_REQUEST>;
export type UpdateQuestioWithOptionsRequest = z.infer<typeof QuestionSchema.UPDATE_QUESTION_WITH_OPTIONS_REQUEST>;
export type QuestionResponse = z.infer<typeof QuestionSchema.QUESTION_MODEL>;
export type QuestionOptionsResponse = z.infer<typeof QuestionSchema.QUESTION_OPTIONS_MODEL>;
//# sourceMappingURL=question.schema.d.ts.map