import type { Request, Response } from "express";
import { catchAsync } from "../utils/catch-async.util.js";
import { UserService } from "../services/user.service.js";
import { sendSuccess } from "../utils/response-formatter.util.js";
import { StatusCodes } from "http-status-codes";

export class UserController {
   static getAllUsers = catchAsync(async (req: Request, res: Response) => {
      const responseData = await UserService.getAllUsers();
      sendSuccess(
         res,
         StatusCodes.OK,
         "Berhasil mengambil data pengguna",
         responseData
      );
   });

   static updateUser = catchAsync(async (req: Request, res: Response) => {
      const userId = req.params.id as string;
      const data = req.body;
      const responseData = await UserService.updateUser(userId, data);
      sendSuccess(
         res,
         StatusCodes.OK,
         "Berhasil memperbarui data pengguna",
         responseData
      );
   });

   static deleteUser = catchAsync(async (req: Request, res: Response) => {
      const userId = req.params.id as string;
      await UserService.deleteUser(userId);
      sendSuccess(
         res,
         StatusCodes.OK,
         "Berhasil menghapus pengguna",
         null
      );
   });
}
