import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { LessonController } from "../controllers/lesson.controller.js";
import { isAdminMiddleware } from "../middlewares/isAdmin.middleware.js";

export const lessonRouter = Router();

// AUTH
lessonRouter.use(authMiddleware);

lessonRouter.get("/:id", LessonController.getLessonDetail);

// ADMIN
lessonRouter.use(isAdminMiddleware)

// CRUD Lesson
lessonRouter.post("/", LessonController.createLesson);
lessonRouter.put("/:id", LessonController.updateLesson);
lessonRouter.delete("/:id", LessonController.deleteLesson);

// Manajemen Material (Menggunakan PUT/POST dengan ID Lesson sesuai perbaikan arsitektur kita)
lessonRouter.post("/:id/material", LessonController.upsertMaterial);
lessonRouter.put("/:id/material", LessonController.upsertMaterial);

// Menambah Soal Kuis ke dalam Lesson
lessonRouter.post("/:id/questions", LessonController.createQuestionWithOption);
