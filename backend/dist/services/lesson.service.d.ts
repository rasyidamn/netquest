import { type CreateLessonRequest, type LessonResponse } from "../schemas/lesson.schema.js";
import { type MaterialResponse, type UpdateMaterialRequest } from "../schemas/material.schema.js";
import { type CreateQuestionWithOptionRequest, type QuestionOptionsResponse, type UpdateQuestioWithOptionsRequest } from "../schemas/question.schema.js";
export declare class LessonService {
    static getLessonByModule: (moduleId: string) => Promise<LessonResponse[]>;
    static getLessonDetail: (lessonId: string, role: string) => Promise<LessonResponse>;
    static createLesson: (moduleId: string, validatedData: CreateLessonRequest) => Promise<LessonResponse>;
    static updateLesson: (lessonId: string, validatedData: any) => Promise<{
        id: string;
        moduleId: string;
        title: string;
        lessonSequence: number;
        type: "THEORY" | "QUIZ";
        xpReward: number;
    }>;
    static deleteLesson: (lessonId: string) => Promise<void>;
    static upsertMaterial: (lessonId: string, validatedData: UpdateMaterialRequest) => Promise<MaterialResponse>;
    static createQuestionWithOption: (lessonId: string, validatedData: CreateQuestionWithOptionRequest) => Promise<QuestionOptionsResponse>;
    static updateQuestionWithOption: (questionId: string, validatedData: UpdateQuestioWithOptionsRequest) => Promise<{
        id: string;
        lessonId: string;
        questionText: string;
        xpReward: number;
        type: "MULTIPLE_CHOICE" | "CALCULATION_INPUT" | "COMMAND_TYPING" | "SORTING" | "MATCHING" | "IMAGE_LABELING";
        options: {
            id: string;
            questionId: string;
            optionText: string;
            isCorrect: boolean;
        }[];
    }>;
    static deleteQuestion: (questionId: string) => Promise<void>;
}
//# sourceMappingURL=lesson.service.d.ts.map