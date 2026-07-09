import { prisma } from "../configs/database.config.js";
import { ApiError } from "../utils/api-error.util.js";
import { StatusCodes } from "http-status-codes";
import type { RoleEnum } from "../generated/prisma/client.js";

export class UserService {
   static async getAllUsers() {
      return await prisma.user.findMany({
         select: {
            id: true,
            nim: true,
            name: true,
            role: true,
            xp: true,
            hearts: true,
            createdAt: true,
         },
         orderBy: {
            createdAt: "desc",
         },
      });
   }

   static async updateUser(
      id: string,
      data: { name?: string; nim?: string; role?: RoleEnum; xp?: number }
   ) {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
         throw new ApiError(StatusCodes.NOT_FOUND, "Pengguna tidak ditemukan");
      }

      // Pastikan NIM unik jika diubah
      if (data.nim && data.nim !== user.nim) {
         const existingNim = await prisma.user.findUnique({
            where: { nim: data.nim },
         });
         if (existingNim) {
            throw new ApiError(
               StatusCodes.CONFLICT,
               "NIM sudah digunakan oleh pengguna lain"
            );
         }
      }

      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.nim !== undefined) updateData.nim = data.nim;
      if (data.role !== undefined) updateData.role = data.role;
      if (data.xp !== undefined) updateData.xp = Number(data.xp);

      return await prisma.user.update({
         where: { id },
         data: updateData,
         select: {
            id: true,
            nim: true,
            name: true,
            role: true,
            xp: true,
            hearts: true,
         },
      });
   }

   static async deleteUser(id: string) {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
         throw new ApiError(StatusCodes.NOT_FOUND, "Pengguna tidak ditemukan");
      }

      await prisma.user.delete({ where: { id } });
      return null;
   }
}
