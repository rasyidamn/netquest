import z from "zod";
export declare class LeaderboardSchema {
    static readonly LEADERBOARD_QUERY: z.ZodObject<{
        limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    }, z.z.core.$strip>;
    static readonly LEADERBOARD_ITEM: z.ZodObject<{
        rank: z.ZodNumber;
        name: z.ZodString;
        xp: z.ZodNumber;
        level: z.ZodNumber;
    }, z.z.core.$strip>;
    static readonly LEADERBOARD_RESPONSE: z.ZodArray<z.ZodObject<{
        rank: z.ZodNumber;
        name: z.ZodString;
        xp: z.ZodNumber;
        level: z.ZodNumber;
    }, z.z.core.$strip>>;
}
export type LeaderboardQuery = z.infer<typeof LeaderboardSchema.LEADERBOARD_QUERY>;
export type LeaderboardItem = z.infer<typeof LeaderboardSchema.LEADERBOARD_ITEM>;
//# sourceMappingURL=leaderboard.schema.d.ts.map