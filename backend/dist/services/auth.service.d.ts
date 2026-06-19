import { type LoginRequest, type RegisterRequest, type RegisterResponse } from "../schemas/user.schema.js";
export declare class AuthService {
    static register: (validatedData: RegisterRequest) => Promise<RegisterResponse>;
    static login: (validatedData: LoginRequest) => Promise<{
        user: RegisterResponse;
    }>;
    static getProfile: (userId: string) => Promise<{
        id: string;
        nim: string;
        name: string;
        xp: number;
        hearts: number;
        heartsUpdatedAt: Date;
        recoveryCount: number;
        lastRecoveryDate: Date;
        createdAt: Date;
        role?: "ADMIN" | "MAHASISWA" | undefined;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map