import { type CreateModuleRequest, type ModuleResponse, type UpdateModuleRequest } from "../schemas/module.schema.js";
export declare class ModuleService {
    static getAllModules: (role?: string) => Promise<ModuleResponse[]>;
    static createModule: (validatedData: CreateModuleRequest) => Promise<ModuleResponse>;
    static updateModule: (moduleId: string, validatedData: UpdateModuleRequest) => Promise<ModuleResponse>;
    static deleteModule: (moduleId: string) => Promise<void>;
}
//# sourceMappingURL=module.service.d.ts.map