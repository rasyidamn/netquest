import z from "zod";

export const QuestionType = z.enum([
	"MULTIPLE_CHOICE",
	"CALCULATION_INPUT",
	"COMMAND_TYPING",
	"SORTING",
	"MATCHING",
	"IMAGE_LABELING",
]);

export const OptionModel = z.object({
	id: z.uuid(),
	questionId: z.string(),
	optionText: z.string().min(1, "Teks opsi tidak boleh kosong"),
	isCorrect: z.boolean(),
});

// 2. Gabungkan ke dalam QuestionModel
export const QuestionModel = z.object({
	id: z.uuid(),
	lessonId: z.string(),
	questionText: z.string().min(5, "Teks pertanyaan minimal 5 karakter"),
	xpReward: z.number().int(),
	type: QuestionType.optional(), // Pastikan QuestionType (enum) sudah di-import/didefinisikan

	// Gunakan z.array() karena ini adalah daftar pilihan ganda
	// Anda juga bisa menambahkan .min(2) untuk memaksa soal memiliki minimal 2 opsi
	options: z
		.array(OptionModel)
		.min(2, "Setiap soal minimal harus memiliki 2 opsi jawaban"),
});

// Anda bisa mengekstrak tipe TypeScript-nya secara otomatis jika diperlukan:
export type Option = z.infer<typeof OptionModel>;
export type Question = z.infer<typeof QuestionModel>;
