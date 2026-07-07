import { z } from "zod";

export const questionFormSchema = z
	.object({
		id: z.string().optional(),
		type: z.enum([
			"MULTIPLE_CHOICE",
			"COMMAND_TYPING",
			"CALCULATION_INPUT",
			"MATCHING",
			"SORTING",
			"TOPOLOGY",
			"RAPID_TRUE_FALSE",
			"VISUAL_IDENTIFICATION",
		]),
		questionSequence: z.number({ message: "Urutan harus berupa angka" })
			.int()
			.positive("Urutan harus positif"),
		questionText: z.string().min(5, "Pertanyaan terlalu pendek"),
		options: z
			.array(
				z.object({
					id: z.string().optional(),
					optionText: z
						.string()
						.min(1, "Opsi/Jawaban tidak boleh kosong"),
					isCorrect: z.boolean(),
				}),
			)
			.optional()
			.default([]),
		matchingPairs: z
			.array(
				z.object({
					left: z.string().min(1, "Sisi kiri wajib diisi"),
					right: z.string().min(1, "Sisi kanan wajib diisi"),
				}),
			)
			.optional(),
		imageLabels: z
			.array(
				z.object({
					value: z.string().min(1, "Label wajib diisi"),
				}),
			)
			.optional(),
		topologyNodes: z.any().optional(),
		topologyEdges: z.any().optional(),
		baseImageUrl: z.string().optional(),
		hotspots: z
			.array(
				z.object({
					id: z.string().optional(),
					x: z.number(),
					y: z.number(),
					isCorrect: z.boolean(),
				})
			)
			.optional(),
	})
	.superRefine((data, ctx) => {
		if (data.type === "MULTIPLE_CHOICE") {
			if (data.options.length < 2) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Pilihan ganda minimal harus memiliki 2 opsi",
					path: ["options"],
				});
			}
			if (!data.options.some((opt) => opt.isCorrect)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Pilihan ganda harus memiliki 1 jawaban benar",
					path: ["options"],
				});
			}
		} else if (data.type === "MATCHING") {
			if (!data.matchingPairs || data.matchingPairs.length < 2) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						"Kuis menjodohkan minimal memiliki 2 pasang jawaban",
					path: ["matchingPairs"],
				});
			}
		} else if (data.type === "SORTING") {
			if (!data.imageLabels || data.imageLabels.length < 2) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Minimal harus ada 2 label/item untuk diurutkan",
					path: ["imageLabels"],
				});
			}
		} else if (data.type === "TOPOLOGY") {
			if (!data.topologyNodes || data.topologyNodes.length < 2) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						"Minimal harus ada 2 perangkat (nodes) untuk disambungkan",
					path: ["topologyNodes"],
				});
			}
		} else if (data.type === "VISUAL_IDENTIFICATION") {
			if (!data.baseImageUrl) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Gambar utama wajib diunggah",
					path: ["baseImageUrl"],
				});
			}
			if (!data.hotspots || data.hotspots.length < 2) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Minimal buat 2 titik lokasi",
					path: ["hotspots"],
				});
			} else if (!data.hotspots.some((h) => h.isCorrect)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Harus ada 1 titik lokasi yang benar",
					path: ["hotspots"],
				});
			}
		} else {
			// COMMAND_TYPING / CALCULATION_INPUT
			if (data.options.length < 1) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Kunci jawaban harus diisi",
					path: ["options"],
				});
			}
		}
	});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;
