import { z } from "zod";
export declare class OptionSchema {
    static readonly OPTION_MODEL: z.ZodObject<{
        id: z.ZodUUID;
        questionId: z.ZodString;
        optionText: z.ZodString;
        isCorrect: z.ZodBoolean;
    }, z.core.$strip>;
    static readonly CREATE_OPTION_REQUEST: z.ZodObject<{
        questionId: z.ZodString;
        optionText: z.ZodString;
        isCorrect: z.ZodBoolean;
    }, z.core.$strict>;
    static readonly UPDATE_OPTION_REQUEST: z.ZodObject<{
        questionId: z.ZodOptional<z.ZodString>;
        optionText: z.ZodOptional<z.ZodString>;
        isCorrect: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>;
    static readonly OPTION_ID_PARAM: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}
export type CreateOptionRequest = z.infer<typeof OptionSchema.CREATE_OPTION_REQUEST>;
export type UpdateOptionRequest = z.infer<typeof OptionSchema.UPDATE_OPTION_REQUEST>;
export type OptionResponse = z.infer<typeof OptionSchema.OPTION_MODEL>;
//# sourceMappingURL=option.schema.d.ts.map