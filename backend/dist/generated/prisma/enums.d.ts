export declare const RoleEnum: {
    readonly ADMIN: "ADMIN";
    readonly MAHASISWA: "MAHASISWA";
};
export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];
export declare const LessonTypeEnum: {
    readonly THEORY: "THEORY";
    readonly QUIZ: "QUIZ";
};
export type LessonTypeEnum = (typeof LessonTypeEnum)[keyof typeof LessonTypeEnum];
export declare const ProgressStatusEnum: {
    readonly LOCKED: "LOCKED";
    readonly ACTIVE: "ACTIVE";
    readonly COMPLETED: "COMPLETED";
};
export type ProgressStatusEnum = (typeof ProgressStatusEnum)[keyof typeof ProgressStatusEnum];
export declare const QuestionType: {
    readonly MULTIPLE_CHOICE: "MULTIPLE_CHOICE";
    readonly CALCULATION_INPUT: "CALCULATION_INPUT";
    readonly COMMAND_TYPING: "COMMAND_TYPING";
    readonly SORTING: "SORTING";
    readonly MATCHING: "MATCHING";
    readonly IMAGE_LABELING: "IMAGE_LABELING";
    readonly TOPOLOGY: "TOPOLOGY";
};
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];
//# sourceMappingURL=enums.d.ts.map