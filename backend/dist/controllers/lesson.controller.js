import { catchAsync } from "../utils/catch-async.util.js";
import { ModuleSchema } from "../schemas/module.schema.js";
import { LessonService } from "../services/lesson.service.js";
import { sendSuccess } from "../utils/response-formatter.util.js";
import { StatusCodes } from "http-status-codes";
import { LessonSchema } from "../schemas/lesson.schema.js";
import { MaterialSchema } from "../schemas/material.schema.js";
import { QuestionSchema } from "../schemas/question.schema.js";
export class LessonController {
    static getLessonByModule = catchAsync(async (req, res) => {
        const params = ModuleSchema.MODULE_ID_PARAM.parse(req.params);
        const responseData = await LessonService.getLessonByModule(params.id);
        sendSuccess(res, StatusCodes.OK, "Berhasil mengambil daftar lesson", responseData);
    });
    static getLessonDetail = catchAsync(async (req, res) => {
        const params = ModuleSchema.MODULE_ID_PARAM.parse(req.params);
        const role = req.user?.role;
        const responseData = await LessonService.getLessonDetail(params.id, role);
        sendSuccess(res, StatusCodes.OK, "Berhasil mengambil detail lesson", responseData);
    });
    static createLesson = catchAsync(async (req, res) => {
        const params = ModuleSchema.MODULE_ID_PARAM.parse(req.params);
        const validatedData = LessonSchema.CREATE_LESSON_REQUEST.parse(req.body);
        const responseData = await LessonService.createLesson(params.id, validatedData);
        sendSuccess(res, StatusCodes.CREATED, "Berhasil membuat lesson", responseData);
    });
    static updateLesson = catchAsync(async (req, res) => {
        const params = LessonSchema.LESSON_ID_PARAM.parse(req.params);
        // Asumsi Anda membuat UPDATE_LESSON_REQUEST di skema yang membuat semua field menjadi opsional (.partial())
        const validatedData = LessonSchema.UPDATE_LESSON_REQUEST.parse(req.body);
        const responseData = await LessonService.updateLesson(params.id, validatedData);
        sendSuccess(res, StatusCodes.OK, "Berhasil memperbarui lesson", responseData);
    });
    static deleteLesson = catchAsync(async (req, res) => {
        const params = LessonSchema.LESSON_ID_PARAM.parse(req.params);
        await LessonService.deleteLesson(params.id);
        sendSuccess(res, StatusCodes.OK, "Berhasil menghapus lesson beserta isinya", null);
    });
    static upsertMaterial = catchAsync(async (req, res) => {
        const params = LessonSchema.LESSON_ID_PARAM.parse(req.params);
        const validatedData = MaterialSchema.CREATE_MATERIAL_REQUEST.parse(req.body);
        const responseData = await LessonService.upsertMaterial(params.id, validatedData);
        sendSuccess(res, StatusCodes.OK, "Berhasil menambahkan materi!", responseData);
    });
    static createQuestionWithOption = catchAsync(async (req, res) => {
        const params = LessonSchema.LESSON_ID_PARAM.parse(req.params);
        const validatedData = QuestionSchema.CREATE_QUESTION_WITH_OPTIONS_REQUEST.parse(req.body);
        const responseData = await LessonService.createQuestionWithOption(params.id, validatedData);
        sendSuccess(res, StatusCodes.CREATED, "Berhasil menambahkan soal!", responseData);
    });
    static updateQuestionWithOption = catchAsync(async (req, res) => {
        // Gunakan skema parameter khusus ID Question
        const params = QuestionSchema.QUESTION_ID_PARAM.parse(req.params);
        const validatedData = QuestionSchema.UPDATE_QUESTION_WITH_OPTIONS_REQUEST.parse(req.body);
        const responseData = await LessonService.updateQuestionWithOption(params.id, validatedData);
        sendSuccess(res, StatusCodes.OK, "Berhasil memperbarui soal dan pilihan ganda!", responseData);
    });
    static deleteQuestion = catchAsync(async (req, res) => {
        const params = QuestionSchema.QUESTION_ID_PARAM.parse(req.params);
        await LessonService.deleteQuestion(params.id);
        sendSuccess(res, StatusCodes.OK, "Berhasil menghapus soal!", null);
    });
}
//# sourceMappingURL=lesson.controller.js.map