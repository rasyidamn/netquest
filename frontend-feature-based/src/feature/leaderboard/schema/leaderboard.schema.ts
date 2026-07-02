import z from "zod";

export const LeaderBoardItem = z.object({
	rank: z.number().int(),
	name: z.string(),
	xp: z.number().int(),
});

export type LeaderboardEntry = z.infer<typeof LeaderBoardItem>[];
