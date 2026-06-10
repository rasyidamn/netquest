import z from "zod";
import { RoleEnum } from "../generated/prisma/enums.js";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);
export class UserSchema {
    static USER_MODEL = z.object({
        id: z
            .uuid()
            .openapi({ example: "cc0f6a91-95dd-498e-b148-dd231d2664fb" }),
        nim: z.string().length(10).openapi({ example: "A710220052" }),
        name: z.string().min(3).openapi({ example: "Ilham Rasyidan" }),
        password: z.string().min(8).openapi({ example: "rahasia123" }),
        role: z.enum(RoleEnum).optional().openapi({ example: "MAHASISWA" }),
        xp: z.number().int().openapi({ example: 0 }),
        level: z.number().int().openapi({ example: 1 }),
        hearts: z.number().int().openapi({ example: 3 }),
        heartsUpdatedAt: z.date(),
        recoveryCount: z.number().int().openapi({ example: 0 }),
        lastRecoveryDate: z.date(),
        createdAt: z.date(),
    });
    static REGISTER_REQUEST = this.USER_MODEL.pick({
        nim: true,
        name: true,
        password: true,
    }).strict();
    static REGISTER_RESPONSE = this.USER_MODEL.omit({
        password: true,
    }).strict();
    static LOGIN_REQUEST = this.REGISTER_REQUEST.omit({
        name: true,
    }).strict();
    static LOGIN_RESPONSE = z.object({
        user: this.REGISTER_RESPONSE,
        accessToken: z.string(),
    });
    static GET_PROFILE_RESPONSE = this.USER_MODEL.omit({
        password: true,
    });
}
//# sourceMappingURL=user.schema.js.map