import { prisma } from "../configs/database.config.js";
import { ApiError } from "../utils/api-error.util.js";
import { StatusCodes } from "http-status-codes";
import type { RoleEnum } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";
import { ProgressStatusEnum } from "../generated/prisma/enums.js";
import { ProgressService } from "./progress.service.js";

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

   static async getUserStats() {
      const totalStudents = await prisma.user.count({ where: { role: "MAHASISWA" } });
      const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });

      const xpAggregate = await prisma.user.aggregate({
         where: { role: "MAHASISWA" },
         _avg: { xp: true },
      });
      const avgXp = Math.round(xpAggregate._avg.xp ?? 0);

      const activeUsersCount = await prisma.userProgress.groupBy({ by: ["userId"] });
      const activeStudents = activeUsersCount.length;

      return { totalStudents, totalAdmins, avgXp, activeStudents };
   }

   static async createUser(data: {
      nim: string;
      name: string;
      role: RoleEnum;
      password?: string;
   }) {
      const existing = await prisma.user.findUnique({ where: { nim: data.nim } });
      if (existing) {
         throw new ApiError(StatusCodes.CONFLICT, "NIM sudah digunakan oleh pengguna lain");
      }

      // Default password = NIM
      const rawPassword = data.password?.trim() || data.nim;
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      const newUser = await prisma.$transaction(async (tx) => {
         const user = await tx.user.create({
            data: {
               nim: data.nim,
               name: data.name,
               role: data.role,
               password: hashedPassword,
            },
            select: { id: true, nim: true, name: true, role: true, xp: true, hearts: true, createdAt: true },
         });

         // Auto-enroll ke lesson pertama jika role MAHASISWA
         if (data.role === "MAHASISWA") {
            const firstLesson = await tx.lesson.findFirst({
               where: { isPublished: true, module: { isPublished: true } },
               orderBy: [{ module: { sequence: "asc" } }, { lessonSequence: "asc" }],
            });
            if (firstLesson) {
               await tx.userProgress.create({
                  data: {
                     userId: user.id,
                     lessonId: firstLesson.id,
                     status: ProgressStatusEnum.ACTIVE,
                     bestScore: 0,
                  },
               });
            }
         }

         return user;
      });

      return newUser;
   }

   static async getUserProgress(userId: string) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
         throw new ApiError(StatusCodes.NOT_FOUND, "Pengguna tidak ditemukan");
      }
      return await ProgressService.getMyProgress(userId);
   }

   static async resetPassword(id: string) {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
         throw new ApiError(StatusCodes.NOT_FOUND, "Pengguna tidak ditemukan");
      }

      const hashedPassword = await bcrypt.hash(user.nim, 10);
      await prisma.user.update({
         where: { id },
         data: { password: hashedPassword },
      });

      return { resetTo: user.nim };
   }

   static async updateUser(
      id: string,
      data: { name?: string; nim?: string; role?: RoleEnum; xp?: number }
   ) {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
         throw new ApiError(StatusCodes.NOT_FOUND, "Pengguna tidak ditemukan");
      }

      if (data.nim && data.nim !== user.nim) {
         const existingNim = await prisma.user.findUnique({ where: { nim: data.nim } });
         if (existingNim) {
            throw new ApiError(StatusCodes.CONFLICT, "NIM sudah digunakan oleh pengguna lain");
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
         select: { id: true, nim: true, name: true, role: true, xp: true, hearts: true },
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
