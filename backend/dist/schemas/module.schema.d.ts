import z from "zod";
export declare class ModuleSchema {
    static readonly MODULE_MODEL: z.ZodObject<{
        id: z.ZodUUID;
        title: z.ZodString;
        sequence: z.ZodNumber;
    }, z.z.core.$strip>;
    static readonly MODULE_ID_PARAM: z.ZodObject<{
        id: z.ZodUUID;
    }, z.z.core.$strict>;
    static readonly CREATE_MODULE_REQUEST: z.ZodObject<{
        title: z.ZodString;
        sequence: z.ZodNumber;
    }, z.z.core.$strict>;
    static readonly UPDATE_MODULE_REQUEST: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        sequence: z.ZodOptional<z.ZodNumber>;
    }, z.z.core.$strict>;
}
export type ModuleIdParam = z.infer<typeof ModuleSchema.MODULE_ID_PARAM>;
export type CreateModuleRequest = z.infer<typeof ModuleSchema.CREATE_MODULE_REQUEST>;
export type UpdateModuleRequest = z.infer<typeof ModuleSchema.UPDATE_MODULE_REQUEST>;
export type ModuleResponse = z.infer<typeof ModuleSchema.MODULE_MODEL>;
//# sourceMappingURL=module.schema.d.ts.map