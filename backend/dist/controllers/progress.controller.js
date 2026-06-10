import { catchAsync } from "../utils/catch-async.util.js";
import { ProgressService } from "../services/progress.service.js";
import { sendSuccess } from "../utils/response-formatter.util.js";
import { StatusCodes } from "http-status-codes";
export class ProgressController {
    static getMyProgress = catchAsync(async (req, res) => {
        // Pastikan authMiddleware Anda meletakkan data user di req.user
        const userId = req.user?.id;
        const responseData = await ProgressService.getMyProgress(userId);
        sendSuccess(res, StatusCodes.OK, "Berhasil memuat peta progres belajar", responseData);
    });
    static getAllProgress = catchAsync(async (req, res) => {
        const responseData = await ProgressService.getAllProgress();
        sendSuccess(res, StatusCodes.OK, "Berhasil memuat rekap progres seluruh mahasiswa", responseData);
    });
}
//# sourceMappingURL=progress.controller.js.map