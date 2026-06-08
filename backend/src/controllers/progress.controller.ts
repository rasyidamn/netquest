import type { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async.util.js";
import { ProgressService } from "../services/progress.service.js";
import { sendSuccess } from "../utils/response-formatter.util.js";
import { StatusCodes } from "http-status-codes";

export class ProgressController {
   static getMyProgress = catchAsync(async (req: Request, res: Response) => {
      // Pastikan authMiddleware Anda meletakkan data user di req.user
      const userId = req.user?.id as string;

      const responseData = await ProgressService.getMyProgress(userId);

      sendSuccess(
         res,
         StatusCodes.OK,
         "Berhasil memuat peta progres belajar",
         responseData
      );
   });

   static getAllProgress = catchAsync(async (req: Request, res: Response) => {
      const responseData = await ProgressService.getAllProgress();

      sendSuccess(
         res,
         StatusCodes.OK,
         "Berhasil memuat rekap progres seluruh mahasiswa",
         responseData
      );
   });
}