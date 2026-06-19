import { ApiError } from "../utils/api-error.util.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
    const token = req.cookies?.access_token;
    if (!token) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, "Akses ditolak! Token tidak ditemukan."));
    }
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET tidak ditemukan di environment!");
        }
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, "Sesi telah berakhir atau token tidak valid. Silakan login kembali."));
    }
};
//# sourceMappingURL=auth.middleware.js.map