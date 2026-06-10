import type { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async.util.js";
import { LeaderboardService } from "../services/leaderboard.service.js";
import { sendSuccess } from "../utils/response-formatter.util.js";
import { StatusCodes } from "http-status-codes";
import { LeaderboardSchema } from "../schemas/leaderboard.schema.js";

export class LeaderboardController {
	static getLeaderboard = catchAsync(async (req: Request, res: Response) => {
		const query = LeaderboardSchema.LEADERBOARD_QUERY.parse(req.query);
		const responseData = await LeaderboardService.getLeaderboard(query.limit);

		sendSuccess(
			res,
			StatusCodes.OK,
			"Berhasil memuat data klasemen (leaderboard)",
			responseData,
		);
	});
}
