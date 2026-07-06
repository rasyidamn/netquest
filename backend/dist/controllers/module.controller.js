import { catchAsync } from "../utils/catch-async.util.js";
import { ModuleService } from "../services/module.service.js";
import { sendSuccess } from "../utils/response-formatter.util.js";
import { StatusCodes } from "http-status-codes";
import { ModuleSchema } from "../schemas/module.schema.js";
export class ModuleController {
    static getAllModules = catchAsync(async (req, res) => {
        const role = req.user?.role;
        const responseData = await ModuleService.getAllModules(role);
        sendSuccess(res, StatusCodes.OK, "Berhasil mengambil data modules", responseData);
    });
    static createModule = catchAsync(async (req, res) => {
        const validatedData = ModuleSchema.CREATE_MODULE_REQUEST.parse(req.body);
        const responseData = await ModuleService.createModule(validatedData);
        sendSuccess(res, StatusCodes.CREATED, "Berhasil membuat module baru", responseData);
    });
    static updateModule = catchAsync(async (req, res) => {
        const params = ModuleSchema.MODULE_ID_PARAM.parse(req.params);
        const validatedData = ModuleSchema.UPDATE_MODULE_REQUEST.parse(req.body);
        const responseData = await ModuleService.updateModule(params.id, validatedData);
        sendSuccess(res, StatusCodes.OK, "Berhasil update module", responseData);
    });
    static deleteModule = catchAsync(async (req, res) => {
        const params = ModuleSchema.MODULE_ID_PARAM.parse(req.params);
        await ModuleService.deleteModule(params.id);
        sendSuccess(res, StatusCodes.OK, "Berhasil delete module", null);
    });
}
//# sourceMappingURL=module.controller.js.map