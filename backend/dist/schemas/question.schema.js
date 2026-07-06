import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { OptionSchema } from "./option.schema.js";
import { QuestionType } from "../generated/prisma/enums.js";
extendZodWithOpenApi(z);
export class QuestionSchema {
    static QUESTION_MODEL = z.object({
        id: z
            .uuid()
            .openapi({ example: "33333333-4444-5555-6666-777777777777" }),
        lessonId: z
            .string()
            .openapi({ example: "11111111-2222-3333-4444-555555555555" }),
        questionText: z.string().min(5, "Pertanyaan harus jelas").openapi({
            example: "Manakah dari berikut ini yang merupakan IP Address kelas C?",
        }),
        xpReward: z
            .number()
            .int()
            .nonnegative("XP tidak boleh negatif")
            .openapi({ example: 15 }),
        type: z.enum(QuestionType).openapi({ example: "MULTIPLE_CHOICE" }),
    });
    static QUESTION_OPTIONS_MODEL = this.QUESTION_MODEL.extend({
        options: z.array(OptionSchema.OPTION_MODEL),
    }).strict();
    static CREATE_BASE = this.QUESTION_MODEL.pick({
        questionText: true,
        xpReward: true,
        type: true,
    }).extend({
        options: z.array(OptionSchema.OPTION_MODEL.pick({
            optionText: true,
            isCorrect: true,
        })).optional(),
        advancedOptions: z.array(z.string()).optional(),
        answerPattern: z.any().optional(),
    }).strict();
    static CREATE_QUESTION_WITH_OPTIONS_REQUEST = this.CREATE_BASE
        .refine((data) => {
        if (data.type === "MULTIPLE_CHOICE" && (!data.options || data.options.length < 2)) {
            return false;
        }
        if ((data.type === "MATCHING" || data.type === "SORTING" || data.type === "IMAGE_LABELING") && (!data.advancedOptions || !data.answerPattern)) {
            return false;
        }
        return true;
    }, {
        message: "Opsi tidak valid untuk tipe soal ini",
        path: ["options"]
    });
    static UPDATE_QUESTION_WITH_OPTIONS_REQUEST = this.CREATE_BASE.partial().strict();
    static QUESTION_ID_PARAM = z.object({
        id: z.uuid("Format ID pertanyaan tidak valid!"),
    });
}
//# sourceMappingURL=question.schema.js.map