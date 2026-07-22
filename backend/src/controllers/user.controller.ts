import type { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async.util.js";
import { UserService } from "../services/user.service.js";
import { sendSuccess } from "../utils/response-formatter.util.js";
import { StatusCodes } from "http-status-codes";

export class UserController {
   static getAllUsers = catchAsync(async (req: Request, res: Response) => {
      const responseData = await UserService.getAllUsers();
      sendSuccess(res, StatusCodes.OK, "Berhasil mengambil data pengguna", responseData);
   });

   static getUserStats = catchAsync(async (_req: Request, res: Response) => {
      const responseData = await UserService.getUserStats();
      sendSuccess(res, StatusCodes.OK, "Berhasil mengambil statistik pengguna", responseData);
   });

   static createUser = catchAsync(async (req: Request, res: Response) => {
      const { nim, name, role, password } = req.body;
      const responseData = await UserService.createUser({ nim, name, role, password });
      sendSuccess(res, StatusCodes.CREATED, "Berhasil menambahkan pengguna baru", responseData);
   });

   static getUserProgress = catchAsync(async (req: Request, res: Response) => {
      const userId = req.params.id as string;
      const responseData = await UserService.getUserProgress(userId);
      sendSuccess(res, StatusCodes.OK, "Berhasil mengambil progres pengguna", responseData);
   });

   static resetPassword = catchAsync(async (req: Request, res: Response) => {
      const userId = req.params.id as string;
      const responseData = await UserService.resetPassword(userId);
      sendSuccess(res, StatusCodes.OK, `Password berhasil direset ke NIM pengguna`, responseData);
   });

   static updateUser = catchAsync(async (req: Request, res: Response) => {
      const userId = req.params.id as string;
      const data = req.body;
      const responseData = await UserService.updateUser(userId, data);
      sendSuccess(res, StatusCodes.OK, "Berhasil memperbarui data pengguna", responseData);
   });

   static deleteUser = catchAsync(async (req: Request, res: Response) => {
      const userId = req.params.id as string;
      await UserService.deleteUser(userId);
      sendSuccess(res, StatusCodes.OK, "Berhasil menghapus pengguna", null);
   });
}
