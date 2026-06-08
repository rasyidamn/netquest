import { StatusCodes } from "http-status-codes";
import { prisma } from "../configs/database.config.js";
import { ApiError } from "../utils/api-error.util.js";
import { ProgressStatusEnum, RoleEnum } from "../generated/prisma/enums.js";

export class ProgressService {
	static getMyProgress = async (userId: string) => {
      // 1. Tarik semua modul beserta seluruh lesson dan progress user di dalamnya
      const modules = await prisma.module.findMany({
         orderBy: { sequence: "asc" },
         include: {
            lessons: {
               orderBy: { lessonSequence: "asc" },
               include: {
                  userProgress: {
                     where: { userId: userId },
                  },
               },
            },
         },
      });

      // 2. Transformasi dan kalkulasi dinamis
      return modules.map((module) => {
         const lessons = module.lessons;
         const userProgresses = lessons.flatMap((l) => l.userProgress);

         // A. Kalkulasi Status Modul
         let moduleStatus: string = ProgressStatusEnum.LOCKED;
         const hasActiveLesson = userProgresses.some((p) => p.status === ProgressStatusEnum.ACTIVE);
         const isAllLessonsCompleted =
            lessons.length > 0 &&
            lessons.every((l) =>
               l.userProgress.some((p) => p.status === ProgressStatusEnum.COMPLETED)
            );

         if (isAllLessonsCompleted) {
            moduleStatus = ProgressStatusEnum.COMPLETED;
         } else if (hasActiveLesson || userProgresses.length > 0) {
            moduleStatus = ProgressStatusEnum.ACTIVE;
         }

         // B. Kalkulasi Best Score (Total skor kuis di dalam modul ini)
         const totalBestScore = userProgresses.reduce((sum, p) => sum + p.bestScore, 0);

         // C. Penentuan Current Lesson ID (Lesson mana yang sedang dikerjakan)
         let currentLessonId = "";
         if (moduleStatus === ProgressStatusEnum.COMPLETED) {
            currentLessonId = lessons[lessons.length - 1]?.id || ""; // Balikkan lesson terakhir jika sudah tamat
         } else {
            const activeProgress = userProgresses.find((p) => p.status === ProgressStatusEnum.ACTIVE);
            currentLessonId = activeProgress ? activeProgress.lessonId : (lessons[0]?.id || "");
         }

         return {
            moduleId: module.id,
            title: module.title,
            sequence: module.sequence,
            status: moduleStatus,
            bestScore: totalBestScore,
            currentLessonId: currentLessonId,
         };
      });
   };

   /**
    * Endpoint 2: GET /api/progress/all (Admin)
    * Menarik rekap data progres seluruh mahasiswa untuk dashboard Admin.
    */
   static getAllProgress = async () => {
      // 1. Tarik semua data mahasiswa beserta progress dan relasi modulnya
      const allUsers = await prisma.user.findMany({
         where: { role: RoleEnum.MAHASISWA },
         select: {
            id: true,
            name: true,
            nim: true,
            progress: {
               include: {
                  lesson: {
                     include: { module: true },
                  },
               },
            },
         },
      });

      const result: any[] = [];

      // 2. Proses pengelompokan (Grouping) per Mahasiswa dan per Modul
      for (const user of allUsers) {
         // Gunakan Map untuk mengelompokkan progress lesson ke dalam wadah modul
         const moduleMap = new Map();

         for (const prog of user.progress) {
            const modId = prog.lesson.moduleId;
            const modTitle = prog.lesson.module.title;

            // Jika modul belum ada di map, buat wadah awalnya
            if (!moduleMap.has(modId)) {
               moduleMap.set(modId, {
                  user: { name: user.name, nim: user.nim },
                  module: { id: modId, title: modTitle },
                  score: 0,
               });
            }

            // Tambahkan skor lesson ini ke total skor modul
            const currentMod = moduleMap.get(modId);
            currentMod.score += prog.bestScore;
         }

         // Masukkan hasil rekap mahasiswa ini ke dalam array final
         result.push(...Array.from(moduleMap.values()));
      }

      // 3. Urutkan berdasarkan nama mahasiswa, lalu nama modul
      result.sort((a, b) => {
         if (a.user.name < b.user.name) return -1;
         if (a.user.name > b.user.name) return 1;
         return a.module.title.localeCompare(b.module.title);
      });

      return result;
   };
}
