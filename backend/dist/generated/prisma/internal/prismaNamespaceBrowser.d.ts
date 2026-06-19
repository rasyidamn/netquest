import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Module: "Module";
    readonly Lesson: "Lesson";
    readonly Material: "Material";
    readonly Question: "Question";
    readonly Option: "Option";
    readonly UserProgress: "UserProgress";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly nim: "nim";
    readonly name: "name";
    readonly password: "password";
    readonly role: "role";
    readonly xp: "xp";
    readonly hearts: "hearts";
    readonly heartsUpdatedAt: "heartsUpdatedAt";
    readonly recoveryCount: "recoveryCount";
    readonly lastRecoveryDate: "lastRecoveryDate";
    readonly createdAt: "createdAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const ModuleScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly sequence: "sequence";
};
export type ModuleScalarFieldEnum = (typeof ModuleScalarFieldEnum)[keyof typeof ModuleScalarFieldEnum];
export declare const LessonScalarFieldEnum: {
    readonly id: "id";
    readonly moduleId: "moduleId";
    readonly title: "title";
    readonly lessonSequence: "lessonSequence";
    readonly type: "type";
    readonly xpReward: "xpReward";
};
export type LessonScalarFieldEnum = (typeof LessonScalarFieldEnum)[keyof typeof LessonScalarFieldEnum];
export declare const MaterialScalarFieldEnum: {
    readonly id: "id";
    readonly lessonId: "lessonId";
    readonly content: "content";
    readonly mediaUrl: "mediaUrl";
};
export type MaterialScalarFieldEnum = (typeof MaterialScalarFieldEnum)[keyof typeof MaterialScalarFieldEnum];
export declare const QuestionScalarFieldEnum: {
    readonly id: "id";
    readonly lessonId: "lessonId";
    readonly questionText: "questionText";
    readonly xpReward: "xpReward";
};
export type QuestionScalarFieldEnum = (typeof QuestionScalarFieldEnum)[keyof typeof QuestionScalarFieldEnum];
export declare const OptionScalarFieldEnum: {
    readonly id: "id";
    readonly questionId: "questionId";
    readonly optionText: "optionText";
    readonly isCorrect: "isCorrect";
};
export type OptionScalarFieldEnum = (typeof OptionScalarFieldEnum)[keyof typeof OptionScalarFieldEnum];
export declare const UserProgressScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly lessonId: "lessonId";
    readonly status: "status";
    readonly bestScore: "bestScore";
    readonly createdAt: "createdAt";
};
export type UserProgressScalarFieldEnum = (typeof UserProgressScalarFieldEnum)[keyof typeof UserProgressScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map