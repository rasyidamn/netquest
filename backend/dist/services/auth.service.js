import { prisma } from "../configs/database.config.js";
import { UserSchema, } from "../schemas/user.schema.js";
import { ApiError } from "../utils/api-error.util.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { ProgressStatusEnum } from "../generated/prisma/enums.js";
import { GameplayService } from "./gameplay.service.js";
export class AuthService {
    static register = async (validatedData) => {
        const nimExisting = await prisma.user.findUnique({
            where: {
                nim: validatedData.nim,
            },
        });
        if (nimExisting) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "NIM sudah terdaftar!");
        }
        validatedData.password = await bcrypt.hash(validatedData.password, 10);
        const result = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: validatedData,
                omit: {
                    password: true,
                },
            });
            const firstLesson = await tx.lesson.findFirstOrThrow({
                orderBy: [
                    { module: { sequence: "asc" } },
                    { lessonSequence: "asc" },
                ],
            });
            await tx.userProgress.create({
                data: {
                    userId: newUser.id,
                    lessonId: firstLesson?.id,
                    status: ProgressStatusEnum.ACTIVE,
                    bestScore: 0,
                },
            });
            return newUser;
        });
        const responseData = UserSchema.REGISTER_RESPONSE.parse(result);
        return responseData;
    };
    static login = async (validatedData) => {
        // nim
        const user = await prisma.user.findUnique({
            where: {
                nim: validatedData.nim,
            },
        });
        if (!user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "NIM atau password salah!");
        }
        // password
        const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "NIM atau password salah!");
        }
        const { password, ...userWithoutPassword } = user;
        const responseData = UserSchema.REGISTER_RESPONSE.parse(userWithoutPassword);
        return { user: responseData };
    };
    static getProfile = async (userId) => {
        // Sinkronisasi nyawa berdasarkan cooldown (lazy evaluation terpusat)
        const user = await GameplayService.syncUserHearts(userId);
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User tidak ditemukan!");
        }
        const responseData = UserSchema.GET_PROFILE_RESPONSE.parse(user);
        return responseData;
    };
}
//# sourceMappingURL=auth.service.js.map