import z from "zod";

export class LeaderboardSchema {
	static readonly LEADERBOARD_QUERY = z.object({
		limit: z
			.string()
			.optional()
			.transform((val) => (val ? parseInt(val, 10) : 10))
			.refine((val) => !isNaN(val) && val > 0, {
				message: "Limit harus berupa angka positif",
			}),
	});

	static readonly LEADERBOARD_ITEM = z.object({
		rank: z.number().int("Peringkat harus berupa angka bulat"),
		name: z.string({ message: "Nama wajib diisi" }),
		xp: z.number().int("XP harus berupa angka bulat"),
	});

	static readonly LEADERBOARD_RESPONSE = z.array(this.LEADERBOARD_ITEM);
}

export type LeaderboardQuery = z.infer<typeof LeaderboardSchema.LEADERBOARD_QUERY>;
export type LeaderboardItem = z.infer<typeof LeaderboardSchema.LEADERBOARD_ITEM>;
