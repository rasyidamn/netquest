import { catchAsync } from "../utils/catch-async.util.js";
import { UserSchema } from "../schemas/user.schema.js";
import { AuthService } from "../services/auth.service.js";
import { sendSuccess } from "../utils/response-formatter.util.js";
import { StatusCodes } from "http-status-codes";
export class AuthController {
    static register = catchAsync(async (req, res) => {
        const validatedData = UserSchema.REGISTER_REQUEST.parse(req.body);
        const responseData = await AuthService.register(validatedData);
        sendSuccess(res, StatusCodes.CREATED, "Berhasil mendaftar akun!", responseData);
    });
    static login = catchAsync(async (req, res) => {
        const validatedData = UserSchema.LOGIN_REQUEST.parse(req.body);
        const responseData = await AuthService.login(validatedData);
        sendSuccess(res, StatusCodes.OK, "Berhasil login", responseData);
    });
    static getProfile = catchAsync(async (req, res) => {
        const validatedData = req.user?.id;
        const responseData = await AuthService.getProfile(validatedData);
        sendSuccess(res, StatusCodes.OK, "Berhasil mendapat data profile", responseData);
    });
}
//# sourceMappingURL=auth.controller.js.map