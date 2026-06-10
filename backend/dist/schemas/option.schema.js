import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);
export class OptionSchema {
    static OPTION_MODEL = z.object({
        id: z
            .uuid()
            .openapi({ example: "44444444-5555-6666-7777-888888888888" }),
        questionId: z
            .string()
            .uuid("Format Question ID tidak valid")
            .openapi({ example: "33333333-4444-5555-6666-777777777777" }),
        optionText: z
            .string()
            .min(1, "Teks opsi tidak boleh kosong")
            .openapi({ example: "192.168.1.1" }),
        isCorrect: z
            .boolean()
            .openapi({ example: true }),
    });
    static CREATE_OPTION_REQUEST = this.OPTION_MODEL.omit({
        id: true,
    }).strict();
    static UPDATE_OPTION_REQUEST = this.CREATE_OPTION_REQUEST.partial().strict();
    static OPTION_ID_PARAM = z.object({
        id: z.uuid("Format ID opsi tidak valid!"),
    });
}
//# sourceMappingURL=option.schema.js.map