import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
extendZodWithOpenApi(z);
export class ModuleSchema {
    static MODULE_MODEL = z.object({
        id: z
            .uuid()
            .openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
        title: z
            .string()
            .trim()
            .min(3, "Judul modul minimal 3 karakter")
            .max(255, "Judul modul terlalu panjang")
            .openapi({ example: "Pengenalan Jaringan Komputer" }),
        description: z
            .string()
            .trim()
            .nullable()
            .default(null)
            .openapi({ example: "Modul ini membahas tentang dasar-dasar jaringan komputer." }),
        sequence: z
            .number()
            .int("Urutan harus berupa bilangan bulat")
            .positive("Urutan modul harus dimulai dari 1 atau lebih")
            .openapi({ example: 1 }),
        isPublished: z
            .boolean()
            .default(false)
            .openapi({ example: false }),
    });
    static MODULE_ID_PARAM = this.MODULE_MODEL.pick({
        id: true,
    }).strict();
    static CREATE_MODULE_REQUEST = this.MODULE_MODEL.omit({
        id: true,
    }).strict();
    static UPDATE_MODULE_REQUEST = this.CREATE_MODULE_REQUEST.partial().strict();
}
//# sourceMappingURL=module.schema.js.map