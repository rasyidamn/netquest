import { z } from "zod";
export declare class MaterialSchema {
    static readonly MATERIAL_MODEL: z.ZodObject<{
        id: z.ZodUUID;
        lessonId: z.ZodString;
        content: z.ZodString;
        mediaUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
    }, z.core.$strip>;
    static readonly CREATE_MATERIAL_REQUEST: z.ZodObject<{
        content: z.ZodString;
        mediaUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
    }, z.core.$strict>;
    static readonly UPDATE_MATERIAL_REQUEST: z.ZodObject<{
        content: z.ZodOptional<z.ZodString>;
        mediaUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodURL>>>;
    }, z.core.$strict>;
    static readonly MATERIAL_ID_PARAM: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}
export type CreateMaterialRequest = z.infer<typeof MaterialSchema.CREATE_MATERIAL_REQUEST>;
export type UpdateMaterialRequest = z.infer<typeof MaterialSchema.UPDATE_MATERIAL_REQUEST>;
export type MaterialResponse = z.infer<typeof MaterialSchema.MATERIAL_MODEL>;
//# sourceMappingURL=material.schema.d.ts.map