import z from "zod";
export declare class UserSchema {
    static readonly USER_MODEL: z.ZodObject<{
        id: z.ZodUUID;
        nim: z.ZodString;
        name: z.ZodString;
        password: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<{
            readonly ADMIN: "ADMIN";
            readonly MAHASISWA: "MAHASISWA";
        }>>;
        xp: z.ZodNumber;
        hearts: z.ZodNumber;
        heartsUpdatedAt: z.ZodDate;
        recoveryCount: z.ZodNumber;
        lastRecoveryDate: z.ZodDate;
        createdAt: z.ZodDate;
    }, z.z.core.$strip>;
    static readonly REGISTER_REQUEST: z.ZodObject<{
        password: z.ZodString;
        nim: z.ZodString;
        name: z.ZodString;
    }, z.z.core.$strict>;
    static readonly REGISTER_RESPONSE: z.ZodObject<{
        id: z.ZodUUID;
        nim: z.ZodString;
        name: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<{
            readonly ADMIN: "ADMIN";
            readonly MAHASISWA: "MAHASISWA";
        }>>;
        xp: z.ZodNumber;
        hearts: z.ZodNumber;
        heartsUpdatedAt: z.ZodDate;
        recoveryCount: z.ZodNumber;
        lastRecoveryDate: z.ZodDate;
        createdAt: z.ZodDate;
    }, z.z.core.$strict>;
    static readonly LOGIN_REQUEST: z.ZodObject<{
        password: z.ZodString;
        nim: z.ZodString;
    }, z.z.core.$strict>;
    static readonly LOGIN_RESPONSE: z.ZodObject<{
        user: z.ZodObject<{
            id: z.ZodUUID;
            nim: z.ZodString;
            name: z.ZodString;
            role: z.ZodOptional<z.ZodEnum<{
                readonly ADMIN: "ADMIN";
                readonly MAHASISWA: "MAHASISWA";
            }>>;
            xp: z.ZodNumber;
            hearts: z.ZodNumber;
            heartsUpdatedAt: z.ZodDate;
            recoveryCount: z.ZodNumber;
            lastRecoveryDate: z.ZodDate;
            createdAt: z.ZodDate;
        }, z.z.core.$strict>;
    }, z.z.core.$strip>;
    static readonly GET_PROFILE_RESPONSE: z.ZodObject<{
        id: z.ZodUUID;
        nim: z.ZodString;
        name: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<{
            readonly ADMIN: "ADMIN";
            readonly MAHASISWA: "MAHASISWA";
        }>>;
        xp: z.ZodNumber;
        hearts: z.ZodNumber;
        heartsUpdatedAt: z.ZodDate;
        recoveryCount: z.ZodNumber;
        lastRecoveryDate: z.ZodDate;
        createdAt: z.ZodDate;
    }, z.z.core.$strip>;
}
export type RegisterRequest = z.infer<typeof UserSchema.REGISTER_REQUEST>;
export type RegisterResponse = z.infer<typeof UserSchema.REGISTER_RESPONSE>;
export type LoginRequest = z.infer<typeof UserSchema.LOGIN_REQUEST>;
export type LoginResponse = z.infer<typeof UserSchema.LOGIN_RESPONSE>;
export type GetProfileResponse = z.infer<typeof UserSchema.GET_PROFILE_RESPONSE>;
//# sourceMappingURL=user.schema.d.ts.map