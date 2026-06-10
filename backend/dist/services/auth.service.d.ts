import { type LoginRequest, type LoginResponse, type RegisterRequest, type RegisterResponse } from "../schemas/user.schema.js";
export declare class AuthService {
    static register: (validatedData: RegisterRequest) => Promise<RegisterResponse>;
    static login: (validatedData: LoginRequest) => Promise<LoginResponse>;
    static getProfile: (userId: string) => Promise<{
        level: number;
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