import z from "zod";
export class GameplaySchema {
    static SUBMIT_ANSWER_REQUEST = z
        .object({
        lessondId: z.uuid(),
        questionId: z.uuid(),
        optionId: z.uuid(),
    })
        .strict();
    static RECOVER_HEART_REQUEST = z
        .object({
        lessonId: z.uuid("Format ID Pelajaran tidak valid"),
        readDuration: z
            .number()
            .min(60, "Anda membaca terlalu cepat! Pahami materi minimal 60 detik."),
    })
        .strict();
    static COMPLETE_QUIZ_REQUEST = z
        .object({
        lessonId: z.uuid(),
        finalScore: z.number().min(0).max(100), // Asumsi skor 0-100
    })
        .strict();
}
//# sourceMappingURL=gameplay.schema.js.map