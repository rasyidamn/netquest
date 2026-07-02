import z from "zod";
export class GameplaySchema {
    static SUBMIT_ANSWER_REQUEST = z
        .object({
        lessonId: z.uuid(),
        questionId: z.uuid(),
        // 'answer' bisa berupa UUID, teks "ping 8.8.8.8", atau stringified JSON '["A", "B"]'
        answer: z.string().min(1, "Jawaban tidak boleh kosong"),
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
        lessonId: z.string().uuid(),
    })
        .strict();
}
//# sourceMappingURL=gameplay.schema.js.map