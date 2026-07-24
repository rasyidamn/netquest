import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export class MaterialSchema {
	static readonly MATERIAL_MODEL = z.object({
		id: z
			.uuid("Format ID tidak valid")
			.openapi({ example: "22222222-3333-4444-5555-666666666666" }),
		lessonId: z
			.string().uuid("Format Lesson ID tidak valid")
			.openapi({ example: "11111111-2222-3333-4444-555555555555" }),
		content: z
			.string()
			.min(10, "Konten materi terlalu singkat")
			.openapi({
				example:
					"<p>Kabel UTP adalah kabel yang digunakan untuk jaringan LAN...</p>",
			}),
		mediaUrl: z
			.url("Format URL media tidak valid")
			.nullable()
			.optional()
			.openapi({ example: "https://youtube.com/watch?v=contoh" }),
	});

	static readonly CREATE_MATERIAL_REQUEST = this.MATERIAL_MODEL.omit({
		id: true,
		lessonId: true,
	}).strict();

	static readonly UPDATE_MATERIAL_REQUEST =
		this.CREATE_MATERIAL_REQUEST.partial().strict();

	static readonly MATERIAL_ID_PARAM = z.object({
		id: z.uuid("Format ID material tidak valid!"),
	});
}

export type CreateMaterialRequest = z.infer<
	typeof MaterialSchema.CREATE_MATERIAL_REQUEST
>;
export type UpdateMaterialRequest = z.infer<
	typeof MaterialSchema.UPDATE_MATERIAL_REQUEST
>;
export type MaterialResponse = z.infer<typeof MaterialSchema.MATERIAL_MODEL>;
