import { z } from "zod";
export declare class UserProgressSchema {
    static readonly USER_PROGRESS_MODEL: z.ZodObject<{
        id: z.ZodUUID;
        userId: z.ZodUUID;
        lessonId: z.ZodUUID;
        status: z.ZodEnum<{
            readonly LOCKED: "LOCKED";
            readonly ACTIVE: "ACTIVE";
            readonly COMPLETED: "COMPLETED";
        }>;
        bestScore: z.ZodNumber;
    }, z.core.$strip>;
    static readonly CREATE_USER_PROGRESS_REQUEST: z.ZodObject<{
        lessonId: z.ZodUUID;
        userId: z.ZodUUID;
        status: z.ZodOptional<z.ZodEnum<{
            readonly LOCKED: "LOCKED";
            readonly ACTIVE: "ACTIVE";
            readonly COMPLETED: "COMPLETED";
        }>>;
        bestScore: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
    static readonly UPDATE_USER_PROGRESS_REQUEST: z.ZodObject<{
        lessonId: z.ZodOptional<z.ZodUUID>;
        userId: z.ZodOptional<z.ZodUUID>;
        status: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
            readonly LOCKED: "LOCKED";
            readonly ACTIVE: "ACTIVE";
            readonly COMPLETED: "COMPLETED";
        }>>>;
        bestScore: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strict>;
    static readonly USER_PROGRESS_ID_PARAM: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}
export type CreateUserProgressRequest = z.infer<typeof UserProgressSchema.CREATE_USER_PROGRESS_REQUEST>;
export type UpdateUserProgressRequest = z.infer<typeof UserProgressSchema.UPDATE_USER_PROGRESS_REQUEST>;
export type UserProgressResponse = z.infer<typeof UserProgressSchema.USER_PROGRESS_MODEL>;
//# sourceMappingURL=user-progress.schema.d.ts.map