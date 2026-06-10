import z from "zod";
export class LeaderboardSchema {
    static LEADERBOARD_QUERY = z.object({
        limit: z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 10))
            .refine((val) => !isNaN(val) && val > 0, {
            message: "Limit harus berupa angka positif",
        }),
    });
    static LEADERBOARD_ITEM = z.object({
        rank: z.number().int(),
        name: z.string(),
        xp: z.number().int(),
        level: z.number().int(),
    });
    static LEADERBOARD_RESPONSE = z.array(this.LEADERBOARD_ITEM);
}
//# sourceMappingURL=leaderboard.schema.js.map